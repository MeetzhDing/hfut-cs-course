const express = require('express');
const router = express.Router();
const knex = require('../tools/knex');
const uuid = require('uuid');
const utility = require("utility");
const jwt = require('jsonwebtoken');
const mail = require('../tools/mail');

const PrivateKey = "skey";

// 用户登录
router.get('/', async function(req, res, next) {
    console.log(`/users get query is ${JSON.stringify(req.query)}`);
    const query = req.query;
    let toBack = {
        "state": false,
        "message": ""
    };
    if (!(query.method === 'userLogin' && 'email' in query && 'password' in query)) {
        toBack.message = "argument";
        res.send(toBack);
        return;
    }
    await knex("users").where("email", "=", query.email).then(async e => {
        console.log(`database users email is ${JSON.stringify(e)}`);
        if (!(e.length > 0 && utility.md5(query.password) === e[0].password)) {
            toBack.message = "wrong password"
            return;
        }
        toBack.state = true;
        toBack.userID = e[0].userID;
        toBack.message = "userLogin success";
        toBack.token = jwt.sign({userID: e[0].userID, email: e[0].email}, PrivateKey, {expiresIn: 60 * 60 * 6});
    });
    res.send(toBack);
});


// 用户注册
router.post('/', async function(req, res, next) {
    console.log(`/users get body is ${JSON.stringify(req.body)}`);
    const body = req.body;
    let toBack = {
        state:false,
        message:""
    };
    if (!(body.method === 'userReg' && 'email' in body && 'password' in body && 'username' in body)) {
        toBack.message = "argument error";
        res.send(toBack);
        return;
    }
    await knex("users").havingIn("email", body.email).then(async e => {
        console.log(`database users email is ${JSON.stringify(e)}`);
        if (Object.keys(e).length > 0) {
            console.log(`register failure: ${JSON.stringify(e)}`);
            toBack.message = "user registered";
            return;
        }
        let userID = uuid.v1();
        let ActiCode = uuid.v1();

        knex("users").insert({
            "userID": userID,
            "email": body.email,
            "activation": false,
            "password": utility.md5(body.password),
            "ActiCode": ActiCode
        }).then(async e => {
                console.log(`Insert Result is ${e}`);
        });
        knex("userinfo").insert({
            userID: userID,
            username: body.username,
            gender: "m",
            age: 1,
            phone: ""
        }).then(async e => {
                console.log(`Insert Result is ${e}`);
        });
        mail.sendVerifyMail(body.email, userID, ActiCode);
        toBack.state = true;
        toBack.message = "userReg success";
        toBack.userID = userID;
    });
    res.send(toBack);
});


// 验证邮箱、重置密码
router.get('/verify', async function(req, res, next){
    console.log(`/users/verify get query is ${JSON.stringify(req.query)}`);
    let query = req.query;
    if (!('method' in query && 'userID' in query && 'ActiCode' in query)) {
        res.render('index', {title: '参数错误'});
    }
    if (query.method === 'verifyEmail') {
        await knex('users').where('userID', '=', query.userID).then(async e => {
            console.log(`database users userID is ${JSON.stringify(e)}`);
            if (Object.keys(e).length > 0) {
                if (e[0].activation === 1) {
                    res.render('index', {title: "用户已验证"});
                } else if (e[0].ActiCode === query.ActiCode) {
                    await knex('users').where('userID', '=', query.userID).update({
                        activation: true,
                        ActiCode: uuid.v1()
                    });
                    res.render('index', {title: "验证成功"});
                } else res.render('index', {title: '验证失败'});
            }
        })
    } else if (query.method === 'resetPassword') {
        await knex('users').where('userID', '=', query.userID).then(async e => {
            console.log(`database users userID is ${JSON.stringify(e)}`);
            if (Object.keys(e).length > 0 && e[0].ActiCode === query.ActiCode) {
                await knex('users').where('userID', '=', query.userID).update({
                    password: utility.md5('abc123'),
                    ActiCode: uuid.v1()
                });
                res.render('index', {title: "密码重置为abc123，请登录后修改"});
            } else {
                res.render('index', {title: '密码重置失败'});
            }
        })
    }
    res.render('index', {title: '参数错误'});
});


// 忘记密码
router.get('/forgetPassword', async function(req,res,next){
    console.log(`/users/forgetPassword get query is ${JSON.stringify(req.query)}`);
    let toBack = {
        state: false,
        message: ""
    };
    if (!(req.query.method === 'forgetPwd' && 'email' in req.query)) {
        toBack.message = "argument error";
        res.send(toBack);
        return;
    }
    await knex('users').having('email', '=', req.query.email).then(async e => {
        console.log(`database users email is ${JSON.stringify(e)}`);
        if (Object.keys(e).length === 0) {
            toBack.message = "email not registered";
            return;
        }
        mail.sendResetMail(req.query.email, e[0].userID, e[0].ActiCode);
        toBack.state = true;
        toBack.message = 'reset email has been sent';
    });
    res.send(toBack);
});


module.exports = router;
