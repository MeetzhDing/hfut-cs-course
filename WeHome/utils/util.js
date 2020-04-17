var config = require('../config.js')
var app = getApp();

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

var IsJsonStr = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

var getDevicesInfo = () => {
  let toSend = {
    action: "getDevicesInfo"
  }
  return new Promise((resolve, reject) => {
    var that = this;
    let url = config.service.host + '/users/' + app.globalData.userInfo.openId + '/devices';
    console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      data: toSend,
      success: function (res) {
        // console.log(res)
        if (res.data.success === true) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: function(res){
        reject('fatel errer');
      }
    })
  })
}

var getIotInfo = function() {
  let toSend = {
    action: "getIotInfo"
  }
  return new Promise((resolve, reject) => {
    var that = this;
    let url = config.service.host + '/users/' + app.globalData.userInfo.openId;
    console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      data: toSend,
      success: function (res) {
        // console.log(res)
        if (res.data.success === true) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: function (err) {
        console.log(err);
        reject('fatel errer');
      }
    })
  })
}

module.exports = {
    formatTime,
    showBusy,
    showSuccess,
    showModel,
    IsJsonStr,
    getIotInfo,
    getDevicesInfo
}

