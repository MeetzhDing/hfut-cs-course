var {getAliyunIotMqttClient} = require('./lib/aliyun-iot-mqtt');
var app = getApp();

function getIotClient(iotInfo){
  let opts = Object.assign({
    regionId: 'cn-shanghai',
    protocol: 'mqtts'
  }, iotInfo)
  var client = getAliyunIotMqttClient(opts);
  client.on('connect', function () {
    console.log(`connected`);
    app.globalData.connected = true;
    client.subscribe(`/${opts.ProductKey}/${opts.DeviceName}/get`, function (err) {
      if(err){
        console.log(err);
      }
    })
  })
  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
  })
  client.on('error', function(err){
    console.log(err);
  })
  client.on('reconnect', function(){
    console.log('reconnect');
  })
  client.on('end', function(){
    console.log('socket end');
    app.globalData.connected = false;
  })
  return client;
}

module.exports = { getIotClient }