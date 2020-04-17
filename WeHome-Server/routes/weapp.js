const express = require('express');
const router = express.Router();
const { auth: { authorization, validation }, mysql: knex } = require('../qcloud');
const iotClient = require('../tools/ali-iot');
const debug = require('debug')('login');
const global = require('../global');


router.all('/login', async (req, res) => {
  let result;
  await authorization(req).then(info => {
    debug(info);
    result = info;
  })

  let userinfo = result.userinfo.userinfo;
  debug(JSON.stringify(global));

  await iotClient.queryDeviceDetail({
    ProductKey: global.products.Clients.ProductKey,
    DeviceName: userinfo.openId
  }).then(async res => {
    debug(res);
    let data = res.Data;
    await knex('clients').having('DeviceName','=',userinfo.openId).then(async res=>{
      if(Object.keys(res).length>0){
        await knex('clients').where('DeviceName','=',userinfo.openId).update({
          GmtCreate: data.GmtCreate===''? null : data.GmtCreate,
          GmtModified: data.GmtModified===''? null : data.GmtModified,
          GmtActive: data.GmtActive===''? null : data.GmtActive,
          GmtOnline: data.GmtOnline===''? null : data.GmtOnline,
          Status: data.Status
        });
        return;
      }
      await knex('clients').insert({
        DeviceName: data.DeviceName,
        ProductKey: data.ProductKey,
        DeviceSecret: data.DeviceSecret
      })
    })
  }).catch(async e => {
    debug(JSON.stringify(e));
    if(e.data &&e.data.Code==='iot.device.NotExistedDevice'){
      await iotClient.registerDevice({
        ProductKey: global.products.Clients.ProductKey,
        DeviceName: userinfo.openId
      }).then(async res => {
        debug(res);
        let data = res.Data;
        await knex('clients').having('DeviceName','=',userinfo.openId).then(async res=>{
          if(Object.keys(res).length>0){
            return;
          }
          await knex('clients').insert({
            DeviceName: data.DeviceName,
            ProductKey: data.ProductKey,
            DeviceSecret: data.DeviceSecret
          })
        })
      })
    } else {
      throw(e);
    }
  })


  res.send({
    code: result.loginState===1 ? 0 : -1,
    data:{
      skey:result.userinfo.skey,
      userinfo: userinfo
    }
  });
})

router.all('/user', async (req, res) => {
  let result
  await validation(req).then(info => {
    result = info;
  })
  res.send({
    code:0,
    data:{
      skey:result.userinfo.skey,
      userinfo: result.userinfo.userinfo
    }
  });
})

module.exports = router;