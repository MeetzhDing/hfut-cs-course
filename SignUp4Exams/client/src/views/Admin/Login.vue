<template>
  <div class="wrap" v-if="show">
    <div class="main">
      <div class="mainin">
        <h1 class="title">后台管理系统</h1>
        <div class="mainin1">
          <ul>
            <li><input v-model="username" type="text" placeholder="账号" class="SearchKeyword"></li>
            <li><input v-model="password" type="password" placeholder="密码" class="SearchKeyword2"></li>
            <li style="margin-top:-5px">
              <div style="float:left;margin-top:12px;margin-left:3px"><span>验证码：</span></div>
              <div class="code" @click="refreshCode" style="float:left"><s-identify :identifyCode="identifyCode"></s-identify></div>
              <div style="float:left;margin-left:20px;margin-top:13px">
                <input v-model="identify" type="text" placeholder="验证码" class="SearchKeyword3" maxlength="4">
              </div>
            </li>
            <li><button class="tijiao" @click="login">提交</button></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SIdentify from '../../components/Tools/identify'
export default {
  components: {
    's-identify': SIdentify
  },
  methods: {
    login: function () {
      let that = this
      if (this.identify != this.identifyCode) {
        this.$message.error('验证码错误')
      } 
      else if(!/^[0-9a-zA-Z]{5,12}$/.test(this.username)){
        this.$message.error('账号格式不合法')
      }
      else if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password)){
        this.$message.error('密码格式不正确')
      }
      else {
        this.$axios.get(this.global.host+'/admin/login',{
          params:{
            //method:'用户登录',
            username:this.username,
            password:this.password
          }}).then(function(r){
            if(r.data.state == true){
              that.$cookies.set('adminToken',r.data.token,60*60)
              that.$router.push('/admin/home/default')
            }
            else that.$message(r.data.message)
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
  },
  data() {
    return {
      username: '',
      password: '',
      identify: '',
      identifyCodes: "1234567890",
      identifyCode: "",
      adminToken:this.$cookies.get('adminToken'),
      show:false
    }
  },
  beforeMount () {
    let that = this
    this.$axios.get(this.global.host+'/admin/verify',{
      headers:{'authorization':'Bearer '+this.adminToken}
    }).then(r=>{
      if(r.data.state == true){
        that.$router.push('/admin/home/default')
      }
      that.show = true
    }).catch(r=>{
      that.show = true
    })
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
    console.log(this.identifyCode)
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
.wrap{background: hsl(203, 100%, 35%) url(../../assets/lgbg.png) center top no-repeat;width: 100%;min-width: 960px; position: absolute; top:0px; left:0px;height: 100%}

.main{ margin:0 auto; width:960px; overflow:hidden;}
.mainin{ margin:0 auto; width:381px; overflow:hidden; clear:both; padding-top:109px;}
.mainin h1{ float:left; width:100%; height:22px; text-align:center; padding-bottom:22px; font-size: 30px;color: white;}
.mainin1{ float:left; width:381px; height:324px; background:url(../../assets/hj.png) no-repeat;}
.mainin1 ul{ float:left; padding:25px 25px 0px; overflow:hidden; width:331px;}
.mainin1 ul li{ float:left; width:100%; overflow:hidden; padding-bottom:25px;}
.mainin1 ul li span, .mainin1 ul li input{ float:left;}
.mainin1 ul li span{ width:100%; clear:both; color:#6f6f6f; font-family:"Microsoft YaHei"; font-size:14px; line-height:37px;}
.main1 ul li a{font-size:30px}
.SearchKeyword {border:1px solid #c8c8c8;width: 202px;color: #999;font-size:12px; line-height:35px; background:url(../../assets/srbg.png) no-repeat; height:35px; width:317px; padding-left:10px;}
.SearchKeyword2 {border:1px solid #c8c8c8;width: 202px;color: #999;font-size:12px; line-height:35px; background:url(../../assets/srbg.png) no-repeat; height:35px; width:317px; padding-left:10px;}
.SearchKeyword3 {border:1px solid #c8c8c8;width: 202px;color: #999;font-size:12px; line-height:35px; background:url(../../assets/srbg.png) no-repeat; height:35px; width:100px; padding-left:10px;}

@media screen and (-webkit-min-device-pixel-ratio:0){.SearchKeyword2 {border:1px solid #c8c8c8;width: 202px;color: #999;line-height:35px; background:url(../../assets/srbg.png) no-repeat; height:35px; width:317px; padding-left:10px;}}
.SearchKeywordonFocus, .SearchKeywordonFocus2{border:1px solid #3c9ae9;width: 202px;line-height:35px;color: #333;font-size:14px; background:url(../../assets/srbg.png) no-repeat; height:35px; width:317px; padding-left:10px;}
@media screen and (-webkit-min-device-pixel-ratio:0){.SearchKeywordonFocus2{ font-size:25px;}}
.tijiao{ float:left; margin:0px 0px 0px 70px; height:42px; width:190px; background:none; border:none; background:url(../../assets/dl.png) no-repeat; font-weight:bold; text-align:center; color:#fff; font-size:20px;font-family:"Microsoft YaHei"; cursor:pointer;}
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