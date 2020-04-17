const express = require('express');
const router = express.Router();
const knex = require('../tools/knex');
const utility = require("utility");
const jwt = require('jsonwebtoken');

const PrivateKey = "skey";


// 管理员登录
router.get('/login',async function (req,res){
    console.log(`/admin/login get query is ${JSON.stringify(req.query)}`);
    const query = req.query;
    let toBack = {
        "state": false,
        "message": "",
        "token":""
    };
    if (!('username' in query && 'password' in query)) {
        toBack.message = "argument error";
        res.send(toBack);
        return;
    }
    await knex("admin").where("username", "=", query.username).then(async e => {
        console.log(`database admin username is ${JSON.stringify(e)}`);
        if (!(e.length > 0 && utility.md5(query.password) === e[0].password)) {
            toBack.message = "wrong password"
            return;
        }
        toBack.state = true;
        toBack.message = "adminLogin success";
        toBack.token = jwt.sign({username: e[0].username}, PrivateKey, {expiresIn: 60 * 60 * 6});
    });
    res.send(toBack);
});


// 验证是否登陆
router.get('/verify',async function(req,res){
    console.log(`/admin/verify get query is ${JSON.stringify(req.query)}`);
  res.send({
    'state':true,
    'message':'token login success'
  })
});

// 获取所有交易记录
router.get('/trades',async function(req,res){
    console.log(`/admin/trades get query is ${JSON.stringify(req.query)}`);
    const query = req.query
    let toBack={
        state:false,
        message:""
    }
    await knex('trades').select('*').then(e =>{
        console.log(`database trades all is ${JSON.stringify(e)}`);
        toBack.trades = e;
        toBack.state = true;
        toBack.message = '查询成功';
    })
    res.send(toBack)
})
module.exports = router;