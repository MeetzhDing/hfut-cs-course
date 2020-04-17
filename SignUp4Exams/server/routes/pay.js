const express = require('express');
const router = express.Router();
const knex = require('../tools/knex');
const ali = require('../tools/alipay');

const gateway = 'https://openapi.alipaydev.com/gateway.do';

router.post('/trade',async function (req, res, next) {
    console.log(`/pay/trade post body is ${JSON.stringify(req.body)}`);
    let body = req.body;
    let toBack = {
        state: false,
        message: ''
    };
    if (!(body.method === 'createTrade' && 'userID' in body && 'subjectID' in body)) {
        toBack.message = 'argument error';
        res.send(toBack);
        return;
    }
    await knex('subjects').having('subjectID', '=', body.subjectID).then(async subjInfo => {
        console.log(`database subjects subjectID is ${JSON.stringify(subjInfo)}`);
        if (Object.keys(subjInfo).length === 0) {
            toBack.message = 'subjectID not exist';
            return;
        }
        let subjectName = subjInfo[0].subjectName;
        let subjectCost = subjInfo[0].subjectCost;
        await knex(`${subjectName}Subject`).having('userID', '=', body.userID).then(async subjUser => {
            console.log(`database ${subjectName}Subject userID is ${JSON.stringify(subjUser)}`);
            if (Object.keys(subjUser).length === 0) {
                toBack.message = 'user not signed up';
                return;
            }
            if (subjUser[0].payment === 1) {
                toBack.message = 'user has paid';
                return;
            }
            // 生成支付连接
            let outTradeId = Date.now().toString();
            console.log(`outTradeId is ${outTradeId}`);
            let payParams = ali.pagePay({
                subject: subjectName,
                body: `${subjectName} 科目报名`,
                outTradeId: outTradeId,
                timeout: '10m',
                amount: subjectCost,
                goodsType: '0',
                qrPayMode: 2
            });
            await knex('trades').insert({
                outTradeId: outTradeId,
                userID: body.userID,
                subjectName: subjectName,
                amount: subjectCost,
                completed: false
            });
            toBack.state = true;
            toBack.message = 'getTradeLink success';
            toBack.tradeLink = `${gateway}?${payParams}`;
            toBack.outTradeId = outTradeId;
        })
    });
    res.send(toBack);
});


// 查询订单状态
router.get('/trade',async function(req,res,next){
    console.log(`/pay/trade get query is ${JSON.stringify(req.query)}`);
    let query = req.query;
    let toBack = {
        state:false,
        message:''
    };
    if (!(query.method === 'queryTrade' && 'outTradeId' in query)) {
        toBack.message = 'argument error';
        res.send(toBack);
        return;
    }
    await knex('trades').having('outTradeId', '=', query.outTradeId).then(async res => {
        console.log(`database trades outTradeId is ${JSON.stringify(res)}`);
        if (Object.keys(res).length === 0) {
            toBack.message = 'tradeId not exist';
            return;
        }
        toBack.state = true;
        toBack.message = 'queryTrade success';
        toBack.tradeInfo = res[0];
    });
    res.send(toBack);
});

module.exports = router;