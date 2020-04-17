const fs = require('fs')
const path = require('path')
const { mysql: config } = require('../config')
const iotClient = require('./ali-iot');
const debug = require('debug')('initdb');
const assert = require('assert');

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.pass,
        database: config.db,
        charset: config.char,
        multipleStatements: true
    }
})


let main = async function(){
    console.log('\n======================================')
    console.log('开始初始化数据库...')

    await knex.schema.dropTableIfExists('cSessionInfo');
    await knex.schema.createTable('cSessionInfo', function(table){
        table.string('open_id',100).notNullable().primary();
        table.string('uuid',100).notNullable();
        table.string('skey',100).notNullable();
        table.timestamp('create_time').notNullable().defaultTo(knex.fn.now());
        table.timestamp('last_visit_time').notNullable().defaultTo(knex.fn.now());
        table.string('session_key',100).notNullable();
        table.string('user_info',2048).notNullable();
        table.engine('InnoDB');
        table.charset('utf8mb4');
        table.collate('utf8mb4_unicode_ci');
        table.comment('会话管理用户信息');
    })
    console.log('小程序登录表初始化成功！');

    await knex.schema.dropTableIfExists('devicesInfo');
    await knex.schema.createTable('devicesInfo', function(table){
        table.string('deviceName',30).notNullable().primary();
        table.string('userId',30).nullable().defaultTo(null);
    })
    await knex('devicesInfo').insert([
        {'deviceName':'esp1'},
        {'deviceName':'esp2'},
        {'deviceName':'esp3'},
        {'deviceName':'esp8266'}
    ]);

    // 查询产品信息
    let productInfo;
    await iotClient.queryProductList({
        CurrentPage: 1,
        PageSize: 5
    }).then(res => {
        debug("queryProductList: " + JSON.stringify(res));
        let productList = res.Data.List;
        if(productList){
            debug("product: " + JSON.stringify(productList.ProductInfo));
            productInfo = productList.ProductInfo;
        }
    });
    assert(productInfo, 'product is null');

    await knex.schema.dropTableIfExists('products');
    await knex.schema.createTable('products', function(table){
        table.string('ProductKey',20).primary();
        table.integer('NodeType').defaultTo(0).notNullable();
        table.string('ProductName',30).notNullable();
        table.integer('DeviceCount').notNullable();
        table.bigInteger('GmtCreate').notNullable();
    })
    await knex('products').insert(productInfo);

    // 生成硬件设备devices表
    await knex.schema.dropTableIfExists('devices');
    await knex.schema.createTable('devices', function(table){
        table.string('DeviceName',30).notNullable();
        table.string('ProductKey',20).notNullable();
        table.string('DeviceSecret').notNullable();
        table.dateTime('GmtCreate').nullable();
        table.dateTime('GmtModified').nullable();
        table.dateTime('GmtActive').nullable();
        table.dateTime('GmtOnline').nullable();
        table.string('Status',10).nullable();
    });
    await iotClient.queryDevice({
        'ProductKey': 'a16dZw8w8UH',
    }).then(async res => {
        debug('Devices' + JSON.stringify(res));
        if(res.Success===true && res.Data && res.Data.DeviceInfo){
            let DeviceInfo = res.Data.DeviceInfo;
            for(const data of DeviceInfo){
                await knex('devices').insert({
                    DeviceName: data.DeviceName,
                    ProductKey: data.ProductKey,
                    DeviceSecret: data.DeviceSecret,
                    Status: data.Status
                })
            }
        }
    })

    // 生成小程序端clients表
    await knex.schema.dropTableIfExists('clients');
    await knex.schema.createTable('clients', function(table){
        table.string('DeviceName',30).notNullable();
        table.string('ProductKey',20).notNullable();
        table.string('DeviceSecret').notNullable();
        table.dateTime('GmtCreate').nullable();
        table.dateTime('GmtModified').nullable();
        table.dateTime('GmtActive').nullable();
        table.dateTime('GmtOnline').nullable();
        table.string('Status',10).nullable();
    });
    console.log('阿里云iot表初始化成功！');
};

main().then(e=>{
    process.exit(0);
}, err => {
    console.log(err);
    process.exit(0);
});
