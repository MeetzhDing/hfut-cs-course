'use strict';

const crypto = require('./hex_hmac_sha1');
const mqtt = require('./mqtt.min');
/**
* options
        productKey
        deviceName
        deviceSecret
*/
exports.getAliyunIotMqttClient = function(opts) {

    if (!opts || !opts.ProductKey ||
        !opts.DeviceName || !opts.DeviceSecret) {
        throw new Error('options need productKey,deviceName,deviceSecret');
    }

    // if (opts.protocol === 'mqtts' && !opts.ca) {
    //     throw new Error('mqtts need ca ');
    // }
    if (!opts.host && !opts.regionId) {
        throw new Error('options need host or regionId (aliyun regionId)');
    }

    const DeviceSecret = opts.DeviceSecret;
    delete opts.DeviceSecret;

    let secureMode = (opts.protocol === 'mqtts') ? 2 : 3;

    var options = {
        productKey: opts.ProductKey,
        deviceName: opts.DeviceName,
        timestamp: Date.now(),
        clientId: Math.random().toString(36).substr(2)
    }
    let keys = Object.keys(options).sort();
    // 按字典序排序
    keys = keys.sort();
    const list = [];
    keys.map((key) => {
        list.push(`${key}${options[key]}`);
    });
    const contentStr = list.join('');

    opts.password = crypto.hex_hmac_sha1(DeviceSecret, contentStr);
    opts.clientId = `${options.clientId}|securemode=${secureMode},signmethod=hmacsha1,timestamp=${options.timestamp}|`;
    opts.username = `${options.deviceName}&${options.productKey}`;

    opts.port = opts.port || 443;
    opts.host = opts.host || `wxs://${opts.ProductKey}.iot-as-mqtt.${opts.regionId}.aliyuncs.com`;
    opts.protocol = opts.protocol || 'mqtts';
    console.log(opts);
    return mqtt.connect(opts.host, {
      clientId: opts.clientId,
      username: opts.username,
      password: opts.password,
      keepalive: 30
    });
}