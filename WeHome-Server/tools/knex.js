const fs = require('fs');
const path = require('path');
const { mysql: config } = require('../config');

module.exports = require('knex')({
    client: 'mysql',
    connection: {
        host: config.host,
        port: config.port,
        user: config.user,
        database: config.db,
        password: config.pass
    }
});