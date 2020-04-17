// var qcloud = require('../../vendor/wafer2-client-sdk/index');
var qcloud = require('wafer2-client-sdk');
var config = require('../../config');
var util = require('../../utils/util.js');
var app = getApp();
var { getIotClient } = require('../../utils/mq.js');

var temp = {}

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        deviceName: '设备ID',
        devicesInfo: [],
        connected: false
    },

    postLogin: function () {
      console.log(this.data.userInfo);
      app.globalData.userInfo = this.data.userInfo;

      util.getIotInfo().then(res=>{
        console.log(res);
        app.globalData.iotInfo = res.data;
        if (res.data.DeviceName && res.data.DeviceSecret && res.data.ProductKey){
          app.globalData.client = getIotClient(res.data);
          setTimeout(()=>{
            wx.startPullDownRefresh();
          }, 1500)
        }
      })
    },

    tapScan: function(e){
      console.log(e);
      let that = this;
      wx.scanCode({
        scanType: ['QR_CODE'],
        success(res) {
          console.log(res);
          console.log(res.result);
          that.setData({ deviceName: res.result});
          temp.deviceName = res.result;
          that.addDevice();
        }
      })
    },

    inputDeviceName: function (e) {
      temp.deviceName = e.detail.value;
    },

    addDevice: function(e){
      console.log(JSON.stringify(e));
      let that = this;
      wx.request({
        url: config.service.host + '/users/' + this.data.userInfo.openId + '/devices',
        method: 'POST',
        data: {
          action: 'bindDevice',
          deviceName: temp.deviceName
        },
        success: function (res) {
          // console.log(res)
          if (res.data.success === true) {
            util.showSuccess('添加成功');
            that.postLogin();
          } else {
            console.log(res.data);
            util.showModel('添加失败', res.data)
          }
        },
        fail: function (err) {
          console.log(err);
          util.showModel('添加失败', err.message)
        }
      })
    },

    doLogin: function (e) {
      util.showBusy('正在登录');
      const session = qcloud.Session.get()
      if (session) {
          // 第二次登录
          // 或者本地已经有登录态
          // 可使用本函数更新登录态
          qcloud.loginWithCode({
              success: res => {
                  this.setData({ userInfo: res, logged: true })
                  util.showSuccess('登录成功')
                  this.postLogin();
              },
              fail: err => {
                  console.error(err)
                  util.showModel('登录错误', err.message)
              }
          })
      } else {
          // 首次登录
          qcloud.login({
              success: res => {
                  this.setData({ userInfo: res, logged: true });
                  util.showSuccess('登录成功');
                  this.postLogin();
              },
              fail: err => {
                  console.error(err)
                  util.showModel('登录错误', err.message)
              }
          })
      }
    },

    clearSession() {
        // 清除保存在 storage 的会话信息
        this.setData({
          logged: false
        })
        qcloud.clearSession();
        util.showSuccess('已注销');
        wx.startPullDownRefresh();
    },

    doRequest() {
      util.showBusy('正在登录');

      // qcloud.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
      qcloud.request({
          // 要请求的地址
          url: this.data.requestUrl,

          // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
          login: true,

          success(result) {
              util.showSuccess('请求成功完成');
              console.log('request success', result);
          },

          fail(error) {
              util.showModel('请求失败', error);
              console.log('request fail', error);
          },

          complete() {
              console.log('request complete');
          }
      });
    },

    onLoad: function () {

    },

    onHide: function () {

    },

    onShow: function() {
      if(this.data.logged){
        if (app.globalData.connected === true) {
          util.getDevicesInfo().then(res => {
            console.log(res);
            app.globalData.devicesInfo = res.data.devicesInfo;
            this.setData({
              devicesInfo: res.data.devicesInfo,
              connected: app.globalData.connected
            })
          }).catch(e => {
            this.setData({
              connected: app.globalData.connected
            })
            console.log(e);
          });
        }
      }
    },

    onPullDownRefresh: function(){
      if(!this.data.logged){
        setTimeout(() => {
          wx.stopPullDownRefresh();
        }, 500); 
        app.globalData.client = null;
        app.globalData.connected = false;
        this.setData({
          devicesInfo: [],
          connected: false
        })
        return;
      }
      if (app.globalData.connected !== true){
        app.globalData.client.reconnect();
      }
      if (app.globalData.connected === true) {
        util.getDevicesInfo().then(res => {
          console.log(res);
          app.globalData.devicesInfo = res.data.devicesInfo;
          this.setData({
            devicesInfo: res.data.devicesInfo,
            connected: app.globalData.connected
          })
          util.showSuccess('更新成功');
        }).catch(e => {
          this.setData({
            connected: app.globalData.connected
          })
          console.log(e);
        });
      }
      setTimeout(()=>{
        wx.stopPullDownRefresh();
      },500); 
    }
})