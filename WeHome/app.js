// var qcloud = require('./vendor/wafer2-client-sdk/index')
var qcloud = require('wafer2-client-sdk');
var config = require('./config');

App({
    globalData: {
      iotInfo: {},
      client: null,
      devicesInfo: []
    },

    onLaunch: function() {
        qcloud.setLoginUrl(config.service.loginUrl)
    }
})