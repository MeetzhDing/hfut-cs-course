var config = require('../../config.js');
var app = getApp();
var util = require('../../utils/util.js');

var tmp = {};
Page({

  data: {
    Status: 'UNACTIVE',
    checked: 'off',
    timing: {
      range: ['on', 'off'],
      plan: 'off',
      running: false,
      time: '00:00'
    }
  },

  changeDeviceState: function(e){
    console.log(e);
    let op = e.detail.value===true? 'on' : 'off'
    if (app.globalData.connected===true) {
      let opts = app.globalData.iotInfo;
      let client = app.globalData.client;
      let toSend = {
        TargetName: this.data.DeviceName,
        method: 'control',
        op: op,
        time: ''
      }
      console.log(`/${opts.ProductKey}/${opts.DeviceName}/update`);
      console.log(JSON.stringify(toSend));
      client.publish(`/${opts.ProductKey}/${opts.DeviceName}/update`, JSON.stringify(toSend));
    }
  },

  deleteConfirm: function () {
    let that = this;
    wx.showModal({
      title: '删除设备',
      content: '你确定要删除设备' + that.data.DeviceName + '吗?',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('删除设备' + that.data.DeviceName);
          wx.request({
            url: config.service.host + '/users/' + app.globalData.userInfo.openId + '/devices',
            method: 'DELETE',
            data: {
              action: 'deleteDevice',
              deviceName: that.data.DeviceName
            },
            success: function (res) {
              // console.log(res)
              if (res.data.success === true) {
                util.showSuccess('删除成功');
                wx.navigateBack({
                  delta: 1
                });
              } else {
                console.log(res.data);
                util.showModel('删除失败', res.data)
              }
            },
            fail: function (err) {
              console.log(err);
              util.showModel('删除失败', err.message)
            }
          })
        } else {
          console.log('取消操作');
        }
      }
    });
  },

  bindPlanChange: function(e){
    console.log(e.detail);
    let plan = e.detail.value==0 ? 'on' : 'off';
    let timing = Object.assign(this.data.timing, {plan:plan})
    this.setData({timing: timing})
  },

  bindTimeChange: function(e){
    console.log(e.detail);
    let time = e.detail.value;
    let timing = Object.assign(this.data.timing, {time: time })
    this.setData({ timing: timing })
  },

  timingChange: function(e){
    console.log(e.detail);
    console.log(this.data.timing);
    if (e.detail.value && app.globalData.connected){
      let opts = app.globalData.iotInfo;
      let client = app.globalData.client;
      let toSend = { 
        TargetName: this.data.DeviceName,
        method: 'timing',
        op: this.data.timing.plan,
        time: this.data.timing.time
      }
      console.log(`/${opts.ProductKey}/${opts.DeviceName}/update`);
      console.log(JSON.stringify(toSend));
      client.publish(`/${opts.ProductKey}/${opts.DeviceName}/update`, JSON.stringify(toSend));
    }
  },

  onLoad: function (option) {
    console.log(option.index);
    let deviceInfo = app.globalData.devicesInfo[option.index];
    console.log(deviceInfo);
    this.setData(deviceInfo);
  },

  onReady: function () {
  
  },

  onShow: function () {
  
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },500);
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
})