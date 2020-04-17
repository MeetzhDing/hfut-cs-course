<template>
  <div class="wrap">
    <div class="main">
      <div class="mainin">
        <h1 class="title">考试在线报名系统</h1>
        <div class="mainin1">
          <ul>
            <li><input v-model="username" type="text" placeholder="邮箱" class="SearchKeyword"></li>
            <li><input v-model="password" type="password" placeholder="密码" class="SearchKeyword2"></li>
            <li style="margin-top:-5px">
              <div style="float:left;margin-top:12px;margin-left:3px"><span>验证码：</span></div>
              <div class="code" @click="refreshCode" style="float:left"><s-identify :identifyCode="identifyCode"></s-identify></div>
              <div style="float:left;margin-left:20px;margin-top:13px">
                <input v-model="identify" type="text" placeholder="验证码" class="SearchKeyword3" maxlength="4">
              </div>
            </li>
            <li><button class="tijiao" @click="login">提交</button></li>
            <li><a @click="reg">注册用户</a>&nbsp;&nbsp;<a @click="showForget">忘记密码</a></li>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog title="注册" :visible.sync="regVisible" width="30%">
      <el-input placeholder="邮箱" v-model="regInfo.email"></el-input>
      <el-input type="password" placeholder="密码（6-16位字母和数字，不能为纯数字/字母）" v-model="regInfo.password"></el-input>
      <el-input type="password" placeholder="确认密码" v-model="regInfo.passwordCfm"></el-input>
      <el-input placeholder="真实姓名（2-4个汉字）" v-model="regInfo.name"></el-input>
      <el-button style="margin-top:10px" @click="submitReg">注册</el-button>
    </el-dialog>
    <el-dialog title="忘记密码" :visible.sync="forgetVisible" width="30%">
      <span>请输入邮箱：</span>
      <el-input style="width:250px" size="small" v-model="forgetEmail"></el-input>
      <el-button style="margin-top:20px" @click="forget">找回密码</el-button>
    </el-dialog>
  </div>
</template>

<script>
import SIdentify from '../components/Tools/identify'
export default {
  components: {
    's-identify': SIdentify
  },
  inject:['reload'],
  methods: {
    reg(){
      this.regVisible = true
    },
    showForget(){
      this.forgetVisible = true
    },
    login: function () {
      let that = this
      if (this.identify != this.identifyCode) {
        this.$message.error('验证码错误')
      }
      else if(!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.username)){
        this.$message.error('邮箱格式不合法')
      }
      else if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password)){
        this.$message.error('密码格式不正确')
      }
      else {
        this.$axios.get(this.global.host+'/users',{
          params:{
            method:'userLogin',
            email:this.username,
            password:this.password
          }}).then(function(r){
            console.log(r.data)
            if(r.data.state == true){
              that.$cookies.set('token',r.data.token,60*60)
              that.$cookies.set('userID',r.data.userID,60*60)
              that.$router.push('/home/default')
            }
            else that.$message.error('用户名或密码错误，请重试')
          }).catch(function(r){
            console.log(r)
          })
      }
      this.refreshCode()
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },
    forget(){
      this.forgetVisible = true;
    },
    submitReg(){
      let emailTest = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      let pwdTest = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
      let nameTest = /^[\u4e00-\u9fa5]{2,4}$/
      let that = this
      if(!emailTest.test(this.regInfo.email)){
        this.$message.error('邮箱格式不合法')
      }
      else if(!pwdTest.test(this.regInfo.password)){
        this.$message.error('密码格式不正确')
      }
      else if(this.regInfo.password != this.regInfo.passwordCfm){
        this.$message.error('两次输入密码不一致')
      }
      else if(!nameTest.test(this.regInfo.name)){
        this.$message.error('姓名必须为中文')
      }
      else{
        this.$axios.post(this.global.host+'/users',{
          method:'userReg',
          email:this.regInfo.email,
          password:this.regInfo.password,
          username:this.regInfo.name
        }).then(function(r){
          console.log(r.data)
          if(r.data.state == true){
            that.$message({
              message:'注册成功',
              type:'success'
            })
            that.regVisible = false
          }
          else that.$message.error(r.data.message)
        }).catch(function(r){
          that.$message.error('未知错误')
        })
      }
    },
    forget(){
      let that = this
      this.$axios.get(this.global.host+'/users/forgetPassword',{
        params:{
          method:'forgetPwd',
          email:this.forgetEmail
        }
      }).then(r=>{
        console.log(r.data)
        if(r.data.state == true){
          that.$message({
            message:"找回密码邮件已发出，请查收您的邮箱",
            type:'success'
          })
        }
        else{
          that.$message.error(r.data.message)
        }
      }).catch(r=>{
        console.log(r)
        that.$message.error('未知错误')
      })
    }
  },
  data() {
    return {
      username: '',
      password: '',
      identify: '',
      identifyCodes: "1234567890",
      identifyCode: "",
      regVisible:false,
      forgetVisible:false,
      regInfo:{
        email:'',
        password:'',
        passwordCfm:'',
        name:''
      },
      forgetEmail:''
    }
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  beforeMount () {
    let that = this
    let token = this.$cookies.get('token')
    let userID = this.$cookies.get('userID')
    this.$axios.get(this.global.host+'/userinfo/'+userID,{
      params:{
        method:'queryUserInfo'
      },
      headers:{
        'authorization':'Bearer '+token
      }
    }).then(function(r){
      console.log(r.data)
      if(r.data.state == true){
        that.$router.push('/home/default')
      }
    })
  }
}
</script>

<style scoped>
h1,h2,h3,h4,h5,h6{font-size:100%;}
address,cite,dfn,em,var{font-style:normal;}
code,kbd,pre,samp{font-family:courier new,courier,monospace;}
small{font-size:12px;}
ul,ol{list-style:none;}
a{text-decoration:none; color:#03329c;}
a:hover{text-decoration:underline; color:#cc0000;}

fieldset,img{border:0;}button,input,select,textarea{font-size:100%;}
table{border-collapse:collapse;border-spacing:0;}
.wrap{background: hsl(203, 100%, 35%) url(../assets/lgbg.png) center top no-repeat;width: 100%;min-width: 960px; position: absolute; top:0px; left:0px;height: 100%}
.main{ margin:0 auto; width:960px; overflow:hidden;}
.mainin{ margin:0 auto; width:381px; overflow:hidden; clear:both; padding-top:109px;}
.mainin h1{ float:left; width:100%; height:22px; text-align:center; padding-bottom:22px; font-size: 30px;color: white;}
.mainin1{ float:left; width:381px; height:400px; background:url(../assets/hj.png) no-repeat;}
.mainin1 ul{ float:left; padding:0px 25px 0px; overflow:hidden; width:331px;}
.mainin1 ul li{ float:left; width:100%; overflow:hidden; padding-bottom:25px;}
.mainin1 ul li span, .mainin1 ul li input{ float:left;}
.mainin1 ul li span{ width:100%; clear:both; color:#6f6f6f; font-family:"Microsoft YaHei"; font-size:14px; line-height:37px;}
.main1 ul li a{font-size:30px}
.SearchKeyword {border:1px solid #c8c8c8;width: 202px;color: #999;font-size:12px; line-height:35px; background:url(../assets/srbg.png) no-repeat; height:35px; width:317px; padding-left:10px;}
.SearchKeyword2 {border:1px solid #c8c8c8;width: 202px;color: #999;font-size:12px; line-height:35px; background:url(../assets/srbg.png) no-repeat; height:35px; width:317px; padding-left:10px;}
.SearchKeyword3 {border:1px solid #c8c8c8;width: 202px;color: #999;font-size:12px; line-height:35px; background:url(../assets/srbg.png) no-repeat; height:35px; width:100px; padding-left:10px;}


.SearchKeywordonFocus, .SearchKeywordonFocus2{border:1px solid #3c9ae9;width: 202px;line-height:35px;color: #333;font-size:14px; background:url(../assets/srbg.png) no-repeat; height:35px; width:317px; padding-left:10px;}

.tijiao{ float:left; margin:0px 0px 0px 70px; height:42px; width:190px; background:none; border:none; background:url(../assets/dl.png) no-repeat; font-weight:bold; text-align:center; color:#fff; font-size:20px;font-family:"Microsoft YaHei"; cursor:pointer;}
.code {
  margin: 10px auto;
  width: 114px;
  height: 40px;
  border: 1px solid red;
}
.el-dialog .el-input{
  padding: 5px;
}

</style>