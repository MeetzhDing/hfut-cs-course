const express = require('express');
const router = express.Router();
const knex = require('../tools/knex');
const ali = require('../tools/alipay');


// 支付宝回调
router.post('/alipay',async function (req,res,next) {
    console.log(`/callback/alipay post body is ${JSON.stringify(req.body)}`);
    let body = Object.assign({},req.body);
    let ok = ali.signVerify(body);
    console.log(`signVerify is ${ok}`);
    if(ok && body.trade_status === 'TRADE_SUCCESS'){
        await knex('trades').having('outTradeId','=',body.out_trade_no).then(async res=>{
            console.log(`database trades outTradeId is ${JSON.stringify(res)}`);
            if(Object.keys(res).length===0){
                return;
            }
            await knex('trades').where('outTradeId','=',body.out_trade_no).update({
                completed: true,
                payTime: body.gmt_payment
            });
            await knex(`${res[0].subjectName}Subject`).where('userID','=',res[0].userID).update({
                payment: true
            });
        })
    }
    res.send('success');
});

module.exports = router;