'use strict';

const knex = require('./knex');
const utility = require("utility");
const uuid = require('uuid');

let main = async function(){

    await knex.schema.dropTableIfExists('admin');
    await knex.schema.createTable('admin', function(table){
        table.increments('id');
        table.string('username').notNullable();
        table.string('password').notNullable();
    });
    await knex('admin').insert({
        username: 'admin',
        password: utility.md5('abc123')
    });

    await knex.schema.dropTableIfExists('users');
    await knex.schema.createTable('users', function(table){
        table.string('userID',36).unique().notNullable();
        table.string('email',20).primary();
        table.boolean('activation').defaultTo(false).notNullable();
        table.string('password',32).notNullable();
        table.string('ActiCode',36).notNullable();
    });

    await knex.schema.dropTableIfExists('userinfo');
    await knex.schema.createTable('userinfo', function(table){
        table.string('userID',36).primary();
        table.string('username',20).notNullable();
        table.string('gender',1).nullable().defaultTo(null);
        table.integer('age').nullable().defaultTo(null);
        table.string('phone',20).nullable().defaultTo(null);
    });

    await  knex('users').insert({
        userID: '0001',
        email: 'mail@qq.com',
        activation: false,
        password: utility.md5('abc123'),
        ActiCode: 'ActiCode'
    });
    await knex('userinfo').insert({
        userID: '0001',
        username: 'name',
        gender: '男',
        age: 20,
        phone: '18888888888'
    });

    await knex.schema.dropTableIfExists('subjects');
    await knex.schema.createTable('subjects', function(table){
        table.increments('subjectID');
        table.string('subjectName', 20).unique();
        table.decimal('subjectCost').notNullable();
        table.dateTime('registerDeadline');
        table.dateTime('examTime');
        table.string('subjectRule', 20).defaultTo(null);
    });

    const courses =  ['语文','数学','英语'];
    for(const n in courses){
        let course = courses[n];
        let Number = parseInt(n) + 1;
        await knex('subjects').insert({
            subjectName: course,
            subjectCost: `2${Number}`,
            registerDeadline: `2019-0${Number+2}-01 00:00:00`,
            examTime: `2019-0${Number+2}-10 08:00:00`,
        });

        await knex.schema.dropTableIfExists(`${course}Subject`);
        await knex.schema.createTable(`${course}Subject`, function(table){
            table.string('userID',36).primary();
            table.boolean('payment').defaultTo(false).notNullable();
            table.float('score').nullable().defaultTo(null);
          });

        await knex(`${course}Subject`).insert({
            userID: '0001',
            payment: false,
            score: null
        });
    }

    await knex.schema.dropTableIfExists('trades');
    await knex.schema.createTable('trades', function (table) {
        table.string('outTradeId').notNullable().primary();
        table.string('userID',36).notNullable();
        table.string('subjectName').notNullable();
        table.decimal('amount').notNullable();
        table.boolean('completed').notNullable().defaultTo(false);
        table.dateTime('payTime').nullable().defaultTo(null);
    });
};

main().then(e=>{
    console.log('数据库初始化成功！');
    process.exit(0);
}, err => {
    throw new Error(err);
});