'use strict';

const assent = require("assert")
const dotenv = require("dotenv");
dotenv.config();

const Client = require("@alicloud/iot-2018-01-20");
const debug = require("debug")("iot");

let config = {
    accessKeyId: process.env.accessKeyId,
    accessKeySecret: process.env.accessKeySecret,
    endpoint: process.env.endpoint
}

const iotClient = new Client(config);

module.exports = iotClient;