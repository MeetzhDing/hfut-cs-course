<template>
    <div v-if="show">
        <el-card>
            <div class = 'info'>
                <div><span style="font-size:13px;">用户ID：{{user.id}}</span></div>
                <div>
                    <span style="font-size:13px;">真实姓名：{{user.name}}</span>
                    <el-popover>
                        <div>
                            <span>新姓名：</span>
                            <el-input maxlength="4" v-model="newInfo.newName" size="small" style="width:100px"></el-input>
                            <el-button size="small" @click="submitNewName">确认</el-button>
                        </div>
                        <el-button size="small" slot="reference">修改</el-button>
                    </el-popover>
                </div>
                <div><span style="font-size:13px;">性别：{{user.gender}}</span><el-button size="small" @click="genderEdit">修改</el-button></div>
                <div>
                    <span style="font-size:13px;">年龄：{{user.age}}</span>
                    <el-popover>
                        <el-slider v-model="newInfo.newAge"></el-slider>
                        <el-button size="small" @click="submitNewAge">确认</el-button>
                        <el-button size="small" slot="reference">修改</el-button>
                    </el-popover>
                </div>
                <div>
                    <span style="font-size:13px;">电话号码：{{user.phone}}</span>
                    <el-popover>
                        <span>新电话号码：</span>
                        <el-input onkeyup="value=value.replace(/[^0-9]/g,'')" maxlength="11" v-model="newInfo.newPhone" size="small" style="width:150px"></el-input>
                        <el-button size="small" @click="submitNewPhone">确认</el-button>
                        <el-button size="small" slot="reference">修改</el-button>
                    </el-popover>
                </div>
                <div><span style="font-size:13px;">密码：</span><el-button size="small" @click="pwdEditVisible = true">修改密码</el-button></div>
            </div>
        </el-card>
        <el-dialog title="修改密码" :visible.sync="pwdEditVisible" width="30%">
            <el-input v-model="newInfo.newPwd" type="password" placeholder="新密码（6-16位非纯字母和数字）"></el-input>
            <el-input v-model="newInfo.newPwdCfm" type="password" placeholder="确认新密码"></el-input>
            <el-button style="margin-left:35%" @click="submitNewPwd">确认修改</el-button>
        </el-dialog>
    </div>
</template>

<script>
export default {
    inject:['reload'],
    data(){
        return{
            token:this.$cookies.get('token'),
            userID:this.$cookies.get('userID'),
            user:{
                id:'',
                name:'',
                gender:'',
                age:0,
                phone:'',
            },
            newInfo:{
                newName:'',
                newAge:20,
                newPhone:'',
                newPwd:'',
                newPwdCfm:''
            },
            pwdEditVisible:false,
            show:false
        }
    },
    methods: {
        genderEdit(){
            let that = this
            this.$confirm('确定要修改性别吗？','确认',{
                confirmButtonText:'确认',
                cancelButtonText:'取消',
                type:'warning'
            }).then(function(){
                that.$axios.put(that.global.host+'/userinfo/'+that.userID,{
                    method:'updateUserInfo',
                    gender:that.user.gender == '男'?'f':'m'
                },{
                    headers:{'authorization':'Bearer '+that.token}
                }).then(function(r){
                    if(r.data.state == true){
                        that.$message('修改成功')
                        that.reload()
                    }
                    else that.$message.error('修改失败')
                }).catch(r=>{
                    that.$message.error('修改失败')
                })
            })
        },
        submitNewName(){
            let that = this
            if(!/^[\u4e00-\u9fa5]{2,4}$/.test(this.newInfo.newName)){
                this.$message.error('姓名输入不合法')
                return
            }
            this.$axios.put(this.global.host+'/userinfo/'+this.userID,{
                method:'updateUserInfo',
                username:that.newInfo.newName
            },{
                headers:{'authorization':'Bearer '+this.token}
            }).then(function(r){
                if(r.data.state == true) that.$message('修改成功')
                else that.$message.error('修改失败')
                that.reload()
            }).catch(r=>{
                that.$message.error('修改失败')
            })
        },
        submitNewAge(){
            let that = this
            this.$axios.put(this.global.host+'/userinfo/'+this.userID,{
                method:'updateUserInfo',
                age:that.newInfo.newAge
            },{
                headers:{'authorization':'Bearer '+this.token}
            }).then(function(r){
                if(r.data.state == true) that.$message('修改成功')
                else that.$message.error('修改失败')
                that.reload()
            }).catch(r=>{
                that.$message.error('修改失败')
            })
        },
        submitNewPhone(){
            let that = this
            this.$axios.put(this.global.host+'/userinfo/'+this.userID,{
                method:'updateUserInfo',
                phone:that.newInfo.newPhone
            },{
                headers:{'authorization':'Bearer '+this.token}
            }).then(function(r){
                if(r.data.state == true){
                    that.$message('修改成功')
                }
                else that.$message.error('修改失败')
                that.reload()
            }).catch(r=>{
                that.$message.error('修改失败')
            })
        },
        submitNewPwd(){
            let that = this
            let pwdTest = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
            if (!pwdTest.test(this.newInfo.newPwd)) {
              this.$message.error('密码格式不正确')
            } 
            else if (this.newInfo.newPwd != this.newInfo.newPwdCfm) {
              this.$message.error('两次输入密码不一致')
            }
            else{
                this.$axios.put(this.global.host+'/userinfo/'+this.userID,{
                    method:'updateUserInfo',
                    password:this.newInfo.newPwd
                },{
                    headers:{'authorization':'Bearer '+this.token}
                }).then(function(r){
                    if(r.data.state == true) that.$message('修改密码成功')
                    else that.$message.error('修改失败')
                    that.reload()
                }).catch(function(r){
                    that.$message.error('修改失败')
                })
            }
        }
    },
    beforeMount () {
        let that = this
        this.$axios.get(this.global.host+'/userinfo/' + this.userID, {
          params: {
            method: 'queryUserInfo'
          },
          headers: {
            'authorization': 'Bearer ' + this.token
          }
        }).then(function (r) {
          console.log(r.data)
          that.user.id = r.data.userID
          that.user.name = r.data.username
          that.user.gender = r.data.gender=='m'?'男':'女'
          that.user.age = r.data.age
          that.newInfo.newAge = r.data.age
          that.user.phone = r.data.phone
          that.show = true
        }).catch(function (r) {
            console.log('出错：'+r)
        })
    }
}
</script>
<style>
.info div{
    float:left;
    width:100%;
    margin:10px;
}
.info{
    margin-bottom: 5px;
}

.info div .el-button{
    margin-left:20px;
}

.el-dialog .el-input{
    padding:6px;
}
</style>


