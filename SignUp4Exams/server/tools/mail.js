const nodemailer = require('nodemailer');
const config = require('../config');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

//配置邮件
const transporter = nodemailer.createTransport({
  service:"QQ",
  secureConnection: true,
  auth: {
      user: config.mailSender,
      pass: config.mailPassword,
    }
});

//发送邮件
const sendMail = function(targetAddress, html){
    var option = {
        from:`"考试报名系统" <${config.mailSender}>`,//发送邮件的邮箱
        to: targetAddress, //目标邮箱
        subject: "用户注册验证"
    };
    option.html= html;
    transporter.sendMail(option, function(error, response){
        if(error){
            console.log("fail: " + error);
        }else{
            console.log("success: "+ response.message);
        }
    });
};


const verifyEmailTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, '../views/email_verify.ejs'), 'utf8'), 'utf8');
const resetPasswordTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, '../views/email_reset.ejs'), 'utf8'), 'utf8');

const sendVerifyMail = function(targetAddress, userID, ActiCode){
    let html = verifyEmailTemplate({url:config.url, userID:userID, ActiCode:ActiCode});
    console.log(html);
    sendMail(targetAddress,html);
};

const sendResetMail = function(targetAddress, userID, ActiCode){
    let html = resetPasswordTemplate({url:config.url, userID:userID, ActiCode:ActiCode});
    console.log(html);
    sendMail(targetAddress,html);
};


module.exports = {
    sendMail,
    sendResetMail,
    sendVerifyMail
};
