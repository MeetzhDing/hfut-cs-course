// 用于维护全局变量
const knex = require('./tools/knex');
let global = {};

async function getProducts(){
    var products = {};
    products.Server = await knex('products').having('ProductName','=','Server').then(res => {
        return res[0];
    });
    products.Clients = await knex('products').having('ProductName','=','Clients').then(res => {
        return res[0];
    });
    products.Devices = await knex('products').having('ProductName','=','Devices').then(res => {
        return res[0];
    });
    delete knex;
    return products;
}

async function main(){
    global.products = await getProducts();
}
console.log(global)
main();

module.exports = global;
