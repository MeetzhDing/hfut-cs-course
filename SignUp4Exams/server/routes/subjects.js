const express = require('express');
const router = express.Router();
const knex = require('../tools/knex');


// 查询科目列表
router.get('/', async function(req, res, next) {
    console.log(`/subjects get query is ${JSON.stringify(req.query)}`);
    let toBack = {
        state: false,
        message: ""
    };
    await knex('subjects').select('*').then(e =>{
        console.log(`database subjects all is ${JSON.stringify(e)}`);
        toBack.subjects = e;
        toBack.state = true;
        toBack.message = '查询成功';
    });
    res.send(toBack);
});


// 取消科目报名
router.delete('/cancelSignUp', async function(req,res){
    console.log(`/subjects/cancelSignUp delete body is ${JSON.stringify(req.body)}`);
    let toBack={
        state:false,
        message:""
    };
    let body = req.body;
    if (!(body.method === 'cancelSubjSign' && 'subjectName' in body)) {
        toBack.message = 'argument error';
        res.send(toBack);
        return;
    }
    await knex(body.subjectName + 'Subject').where('userID','=',body.userID).del().then(async e => {
        console.log(`database ${body.subjectName}Subject userID del is ${JSON.stringify(e)}`);
    });
    toBack.state = true;
    toBack.message = 'cancelSignUp success';
    res.send(toBack);
});


// 科目报名
router.post('/:subjectID/signup', async function(req, res, next){
    console.log(`/subjects/:subjectID/signup post params is ${JSON.stringify(req.params)}`);
    console.log(`/subjects/:subjectID/signup post body is ${JSON.stringify(req.body)}`);
    let toBack = {
        state: false,
        message: "signup failure"
    };
    if(!('subjectID' in req.params && 'userID' in req.body)){
        toBack.message = "argument error";
        res.send(toBack);
        return;
    }
    let subjectID = req.params.subjectID;
    let userID = req.body.userID;
    await knex('subjects').where('subjectID', '=', subjectID).select('subjectName','registerDeadline').then(async e =>{
        console.log(`database subjects subjectID is ${JSON.stringify(e)}`);
        if (e.length === 0) {
            toBack.message = '科目不存在';
            return;
        }
        console.log(`报名的科目是 ${JSON.stringify(e)}`);
        if (new Date(Date()) > new Date(e[0].registerDeadline)) {
            toBack.message = "报名截止时间已过";
            return;
        }
        let subjectName = e[0].subjectName;
        await knex(subjectName + 'Subject').where('userID', '=', userID).then(async n => {
            console.log(`database ${subjectName}Subject userID is ${JSON.stringify(n)}`);
            if (Object.keys(n).length > 0) {
                toBack.message = '已报名';
                return;
            }
            await knex(subjectName + 'Subject').insert({
                    userID: userID,
                    payment: false,
                    score: null
                }).then(res => {
                    console.log(`报名的结果为 ${res}`);
                    toBack.state = true;
                    toBack.message = '报名成功';
                });
        })
    });
    res.send(toBack);
});


// 独立科目分数查询
router.get('/:subjectID/users/:userID', async function(req, res, next){
    console.log(`/subjects/:subjectID/users/:userID get query is ${JSON.stringify(req.query)}`);
    toBack = {
        state: false,
        message: ""
    };
    if (!('subjectID' in req.params && 'userID' in req.params)) {
        toBack.message = "argument error";
        res.send(toBack);
        return;
    }
    let subjectID = req.params.subjectID;
    let userID = req.params.userID;
    toBack.subjectID = subjectID;
    toBack.userID = userID;
    await knex('subjects').where('subjectID', '=', subjectID).select('subjectName').then(async subjNameArray => {
        console.log(`database subjects subjectID is ${JSON.stringify(subjNameArray)}`);
        if (subjNameArray.length === 0) {
            toBack.message = "subject not exist";
            return;
        }
        let subjName = subjNameArray[0].subjectName;
        toBack.subjName = subjName;
        console.log(subjName);
        await knex(subjName + 'Subject').having('userID', '=', userID).then(content => {
            console.log(`database ${subjName}Subject userID is ${JSON.stringify(content)}`);
            if (Object.keys(content).length === 0) {
                toBack.message = "课程号或用户号错误";
                return;
            }
            toBack = Object.assign(toBack, content[0]);
            toBack.state = true;
            toBack.message = "查询成功";
        })
    });
    res.send(toBack);
});


// 添加科目
router.post('/',async function(req, res, next){
    console.log(`/subjects post body is ${JSON.stringify(req.body)}`);
    let toBack = {
        state: false,
        message: ""
    };
    let body = req.body;
    if (!(body.method === 'addSubj' && 'subjectName' in body && 'subjectCost' in body && 'registerDeadline' in body && 'examTime' in body)) {
        toBack.message = 'argument error';
        res.send(toBack);
        return;
    }
    await knex('subjects').having('subjectName', '=', body.subjectName).then(async e => {
        console.log(`database subjects subjectName is ${JSON.stringify(e)}`);
        if (Object.keys(e).length > 0) {
            toBack.message = '课程已存在';
            return;
        }
        let subjectRule = body.subjectRule === undefined ? '' : body.subjectRule;
        await knex('subjects').insert({
            subjectName: body.subjectName,
            subjectCost: body.subjectCost,
            registerDeadline: body.registerDeadline,
            examTime: body.examTime,
            subjectRule: subjectRule
        });
        await knex.schema.createTable(`${body.subjectName}Subject`, function (table) {
            table.string('userID');
            table.boolean('payment').defaultTo(false).notNullable();
            table.float('score').nullable().defaultTo(null);
        });
        toBack.state = true;
        toBack.message = 'addSubj success';
    });
    res.send(toBack);
});


// 删除科目
router.delete('/',async function(req, res, next){
    console.log(`/subjects delete body is ${JSON.stringify(req.body)}`);
    let toBack = {
        state: false,
        message: ""
    };
    let body = req.body;
    if (!(body.method === 'deleteSubj' && 'subjectName' in body)) {
        toBack.message = 'argument error';
        res.send(toBack);
        return;
    }
    await knex('subjects').having('subjectName', '=', body.subjectName).then(async res => {
        console.log(`database subjects subjectName delete is ${JSON.stringify(res)}`);
        if (Object.keys(res).length === 0) {
            toBack.message = 'subj not exist';
            return;
        }
        await knex('subjects').where('subjectName', body.subjectName).del().then(async e => {
            console.log(`database subjects subjectName del is ${JSON.stringify(e)}`);
        });
        await knex.schema.dropTableIfExists(`${body.subjectName}Subject`);
        toBack.state = true;
        toBack.message = 'deleteSubj success';
    });
    res.send(toBack);
});


// 学科登记分数
router.put('/:subjectID/setScore', async function(req, res, next){
    console.log(`params is ${JSON.stringify(req.params)}`);
    console.log(`body is ${JSON.stringify(req.body)}`);
    let subjectID = req.params.subjectID;
    let toBack = {
        state: false,
        message:''
    };
    if (!(req.body.method === 'submitSubjScore' && 'scoreInfo' in req.body) && !Array.isArray(req.body.scoreInfo)) {
        toBack.message = 'argument error';
        res.send(toBack);
        return;
    }
    await knex('subjects').having('subjectID', '=', subjectID).then(async res => {
        console.log(JSON.stringify(res));
        if (Object.keys(res).length === 0) {
            return;
        }
        let subjectName = res[0].subjectName;
        for (const user of req.body.scoreInfo) {
            console.log(JSON.stringify(user));
            await knex(`${subjectName}Subject`).where('userID', user.userID).update({'score': user.score}).then(e => {
                console.log(`影响的行数为 ${JSON.stringify(e)}`);
            });
        }
        toBack.message = 'submitSubjScore success';
        toBack.state = true;
    });
    res.send(toBack);
});


// 查询科目用户信息
router.get('/:subjectID/userinfo',async function(req,res,next){
    console.log(JSON.stringify(req.query));
    let subjectID = req.params.subjectID;
    let toBack = {
        state:false,
        message:''
    };
    if (req.query.method !== "querySubjUser") {
        toBack.message = 'argument error';
        res.send(toBack);
        return;
    }
    await knex('subjects').having('subjectID', '=', subjectID).then(async res => {
        console.log(JSON.stringify(res));
        if (Object.keys(res).length <= 0) {
            toBack.message = 'subjectID not exist';
            return;
        }
        let subjectName = res[0].subjectName;
        await knex(`${subjectName}Subject`).join('userinfo', `${subjectName}Subject.userID`, '=', 'userinfo.userID').then(e => {
            console.log(JSON.stringify(e));
            toBack.state = true;
            toBack.message = 'querySubjUserinfo success';
            toBack.userinfo = e;
        })
    });
    res.send(toBack);
});

module.exports = router;