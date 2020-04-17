const express = require('express');
const router = express.Router();
const knex = require('../tools/knex');
const uuid = require('uuid');
const utility = require("utility");
const jwt = require('jsonwebtoken');

const PrivateKey = "skey";

// 查询用户信息
router.get('/:userID', async function(req, res, next) {
    console.log(`/userinfo/:userID get query is ${JSON.stringify(req.query)}`);
    let toBack = {
        state: false,
        message: ""
    };
    if (req.query.method !== 'queryUserInfo') {
        toBack.message = "argument error";
        res.send(toBack);
        return;
    }
    await knex('userinfo').where('userID', '=', req.params.userID).then(e => {
        console.log(`database userinfo userID is ${JSON.stringify(e)}`);
        if (e.length === 0) {
            toBack.message = 'user not exist';
            return;
        }
        toBack.state = true;
        toBack = Object.assign(toBack, e[0]);
    });
    res.send(toBack);
});

// 更新用户信息
router.put('/:userID', async function(req, res, next) {
    console.log(`/userinfo/:userID put body is ${JSON.stringify(req.body)}`);
    console.log(`/userinfo/:userID get params is ${JSON.stringify(req.params)}`);
    let newInfo = req.body;
    let userID = req.params.userID;
    if('userID' in newInfo){
      delete newInfo.userID;
    }
    let toBack = {
      state: false,
      message: ""
    };
    if (newInfo.method !== 'updateUserInfo') {
        toBack.message = 'argument error';
        res.send(toBack);
        return;
    }
    delete newInfo.method;
    console.log(`进行更新的数据有 ${JSON.stringify(newInfo)}`);
    // 修改密码
    if ('password' in newInfo) {
        await knex('users').where('userID', '=', userID).update({'password': utility.md5(newInfo.password)}).then(n => {
            console.log(`database userinfo userID update is ${JSON.stringify(n)}`);
            delete newInfo.password;
            if (n === 0) {
                toBack.message = 'updateUserInfo failure';
                return;
            }
            if (Object.keys(newInfo).length === 0) {
                toBack.message = 'updateUserInfo success';
                toBack.state = true;
            }
        })
    }
    // 更新其他信息
    if (Object.keys(newInfo).length > 0 && !('password' in newInfo)) {
        await knex('userinfo').where('userID', '=', userID).then(async e => {
            console.log(`database userinfo userID is ${JSON.stringify(e)}`);
            if (e.length === 0) {
                toBack.message = 'updateUserInfo failure';
                return;
            }
            console.log(`newInfo is ${JSON.stringify(newInfo)}`);
            await knex('userinfo').where('userID', '=', userID).update(newInfo).then(n => {
                console.log(`database userinfo userID update is ${JSON.stringify(n)}`);
                if (n > 0) {
                    toBack.state = true;
                    toBack.message = 'updateUserInfo success';
                    toBack.userinfo = Object.assign(e[0], newInfo);
                }
            })
        });
    }
    res.send(toBack);
  });

// 查询用户科目
router.get('/:userID/subjects', async function(req, res, next){
    console.log(`/userinfo/:userID/subjects get query is ${JSON.stringify(req.query)}`);
    console.log(`/userinfo/:userID/subjects get params is ${JSON.stringify(req.params)}`);
    let toBack = {
        state: false,
        message: "",
        subjects: []
    };
    if (req.query.method !== 'queryUserSubj') {
        toBack.message = 'argument error';
        res.send(toBack);
        return;
    }
    await knex('subjects').select('*').then(async e => {
        console.log(`database subjects all is ${JSON.stringify(e)}`);
        let promiseAllArray = [];
        // 创建课程查询函数数组，作为promiseAll参数
        for (subj of e) {
            promiseAllArray.push(async function (userID, subjCopy) {
                console.log(`subjCopy is ${JSON.stringify(subjCopy)}`);
                console.log(`userID is ${JSON.stringify(userID)}`);
                return await knex(subjCopy.subjectName + 'Subject').where('userID', '=', userID).then(subjQuery => {
                    console.log(`database ${subjCopy.subjectName}Subjects userID is ${JSON.stringify(subjQuery)}`);
                    if (Object.keys(subjQuery).length === 0) {
                        return null;
                    } else {
                        console.log(subjQuery[0]);
                        return Object.assign(subjCopy, subjQuery[0])
                    }
                });
            }(req.params.userID, subj));
        }
        // 同时执行有所课程查询
        await Promise.all(promiseAllArray).then(values => {
            console.log(`values is ${JSON.stringify(values)}`);
            // 过滤用户没有参与的课程，未参与课程返回为null
            toBack.subjects = values.filter(item => item !== null);
            toBack.message = 'queryUserSubj success';
            toBack.state = true;
        }).catch(reason => {
            console.log(`reason is ${reason}`);
            toBack.message = 'queryUserSubj failure';
        });
    });
    res.send(toBack);
});

// 查询全体用户信息
router.get('/',async function(req,res){
    console.log(`/userinfo get query is ${JSON.stringify(req.query)}`);
    let toBack={
        state:false,
        message:'',
        userinfo:[]
    };
    if (req.query.method !== "queryUserInfoAll") {
        toBack.message = 'argument error';
        res.send(toBack);
        return;
    }
    await knex('users')
        .join('userinfo', 'userinfo.userID', '=', 'users.userID')
        .select('users.userID', 'email', 'activation', 'username', 'gender', 'age', 'phone')
        .then(res => {
            console.log(`database users join userinfo is ${JSON.stringify(res)}`);
            toBack.userinfo = res;
            toBack.state = true;
            toBack.message = 'queryUserInfoAll success';
        }).catch(e => {
            toBack.message = 'queryUserInfoAll failure';
        });
    res.send(toBack);
});


module.exports = router;
