const express = require('express');
const router = express.Router();
const iotClient = require('../tools/ali-iot');
const global = require('../global');
const { mysql: knex } = require('../qcloud');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// 绑定设备
router.post('/:userId/devices', async function(req,res){
  console.log(`/users/:userId/devices post params ${JSON.stringify(req.params)}`);
  console.log(`/users/:userId/devices post body ${JSON.stringify(req.body)}`);
  let userId = req.params.userId;
  let body = req.body;
  let toBack = {
    success: false,
    message: '',
  }
  if(body.action!=='bindDevice' || !body.deviceName){
    toBack.message='argument error';
    res.send(toBack);
    return;
  }
  await knex('devicesInfo').having('deviceName','=',body.deviceName).then(async res=>{
    if(Object.keys(res).length===0){
      toBack.message='deviceName not exist';
      return;
    }
    await knex('devicesInfo').where('deviceName','=',body.deviceName).update({
      userId: userId
    });
    toBack.success = true;
    toBack.message = 'bind device success'
  })
  res.send(toBack);
})


// 删除设备
router.delete('/:userId/devices', async function(req,res){
  console.log(`/users/:userId/devices delete params ${JSON.stringify(req.params)}`);
  console.log(`/users/:userId/devices delete body ${JSON.stringify(req.body)}`);
  let userId = req.params.userId;
  let body = req.body;
  let toBack = {
    success: false,
    message: '',
  }
  if(body.action!=='deleteDevice' || !body.deviceName){
    toBack.message='argument error';
    res.send(toBack);
    return;
  }
  await knex('devicesInfo').having('deviceName','=',body.deviceName).then(async res=>{
    if(Object.keys(res).length===0){
      toBack.message='deviceName not exist';
      return;
    }
    await knex('devicesInfo').where('deviceName','=',body.deviceName).update({
      userId: null
    });
    toBack.success = true;
    toBack.message = 'delete device success'
  })
  res.send(toBack);
})


// 获取用户iot信息
router.get('/:userId', async function(req,res){
  console.log(`/users/:userId/devices get params ${JSON.stringify(req.params)}`);
  console.log(`/users/:userId/devices get query ${JSON.stringify(req.query)}`);
  let userId = req.params.userId;
  let query = req.query;
  let toBack = {
    success: false,
    message: ''
  }
  if(query.action!=='getIotInfo'){
    toBack.message='argument error';
    res.send(toBack);
    return;
  }
  await knex('clients').having('DeviceName','=',userId).then(async res=>{
    console.log(`database clients userId ${JSON.stringify(res)}`);
    if(Object.keys(res).length===0){
      toBack.message = 'userId not exits'
      return;
    }
    toBack.success = true;
    toBack.message = 'getIotInfo success';
    toBack.data = {
      DeviceName: res[0].DeviceName,
      ProductKey: res[0].ProductKey,
      DeviceSecret: res[0].DeviceSecret
    };
  })
  res.send(toBack);
})


// 获取设备信息
router.get('/:userId/devices', async function(req,res){
  console.log(`/users/:userId/devices get params ${JSON.stringify(req.params)}`);
  console.log(`/users/:userId/devices get query ${JSON.stringify(req.query)}`);
  let userId = req.params.userId;
  let query = req.query;
  let toBack = {
    success: false,
    message: '',
    data: {
      devicesInfo: []
    }
  }
  if(query.action!=='getDevicesInfo'){
    toBack.message='argument error';
    res.send(toBack);
    return;
  }
  await knex('devicesInfo').having('userId','=',userId).then(async res=>{
    console.log(`database devicesInfo userId ${JSON.stringify(res)}`);
    if(Object.keys(res).length===0){
      toBack.success = true;
      toBack.message = 'empty devicesList';
      return;
    }
    let devicesList = res.map(function(device){
      return device.deviceName
    });
    console.log(`devicesList is ${devicesList}`);
    for(const device of res){
      console.log(JSON.stringify(device));
      await knex('devices').having('DeviceName','=',device.deviceName).then(async re=>{
        if(Object.keys(re).length===0){
          return;
        }
        toBack.success = true;
        toBack.data.devicesInfo.push({
          DeviceName: re[0].DeviceName,
          ProductKey: re[0].ProductKey,
          DeviceSecret: re[0].DeviceSecret
        });
      })
    }
    await iotClient.batchGetDeviceState({
      ProductKey: global.products.Devices.ProductKey,
      DeviceName: devicesList
    }).then(status=>{
      console.log(`batchGetDeviceState is ${JSON.stringify(status)}`);
      if(status.Success===true){
        console.log(`deviceStatus is ${status.DeviceStatusList.DeviceStatus}`)
        let devicesInfo = [];
        for(device of toBack.data.devicesInfo){
          let deviceStatus = status.DeviceStatusList.DeviceStatus.find(function(dev){
            return dev.DeviceName === device.DeviceName
          })
          devicesInfo.push(Object.assign(device, deviceStatus))
        }
        console.log(devicesInfo);
        toBack.data.devicesInfo = devicesInfo;
      }
    })
  })
  res.send(toBack);
})


module.exports = router;
