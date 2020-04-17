<template>
    <div>
        <el-breadcrumb separator="/" style="padding:10px">
            <el-breadcrumb-item :to="{ path: '/admin/home/default'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/home/subjects' }">科目管理</el-breadcrumb-item>
            <el-breadcrumb-item>登记分数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div slot="header">考生列表</div>
            <div>
                <el-table :data="userData" style="width:100%" v-loading="loading">
                    <el-table-column prop="username" label="姓名" width="300"></el-table-column>
                    <el-table-column prop="gender" label="性别" width="160"></el-table-column>
                    <el-table-column prop="age" label="年龄" width="160"></el-table-column>
                    <el-table-column prop="score" label="分数" width="160"></el-table-column>
                    <el-table-column label="提交/修改分数">
                        <template scope="scope">
                            <el-input v-model="inputs[scope.$index]" size="small" onkeyup="value=value.replace(/[^0-9]/g,'')" placeholder="请输入分数" style="width:100px"></el-input>
                            <el-button size="small" @click="submitScore(scope.$index,scope.row)">提交</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    inject:['reload'],
    data () {
        return {
            id:this.$route.params.id,
            userData:[],
            adminToken:this.$cookies.get('adminToken'),
            loading:true,
            inputs:[]
        }
    },
    beforeMount () {
        let that = this
        if(this.id === undefined){
            this.$message.error('地址非法访问')
            this.$router.push('/admin/home/subjects')
            return
        }
        console.log(this.id)
        this.$axios.get(this.global.host+'/subjects/'+this.id+'/userinfo',{
            params:{
                method:'querySubjUser'
            },
            headers:{'authorization':'Bearer '+this.adminToken}
        }).then(r=>{
            console.log(r.data)
            if(r.data.state == true){
                //that.userData = r.data.userinfo
                that.inputs = [...Array(that.userData.length)].map(_=>'');
                var u
                for(u of r.data.userinfo){
                    if(u.payment == 1){
                        u.gender = u.gender=='m'?'男':'女'
                        that.userData.push(u)
                    }
                }
                that.loading = false
            }
            else that.$message.error('考生加载失败')
        }).catch(r=>{
            that.$message.error('考生加载失败')
        })
    },
    methods: {
        submitScore(index,row){
            let that = this
            if(this.inputs[index] == '') this.$message.error('分数不可以为空')
            else{
                this.$axios.put(this.global.host+'/subjects/'+this.id+'/setScore',{
                    method:'submitSubjScore',
                    scoreInfo:[{
                        userID:row.userID,
                        score:parseInt(this.inputs[index])
                    }]
                },{
                    headers:{
                        'authorization':'Bearer '+this.adminToken,
                        'Content-Type':'application/json'
                    }
                }).then(r=>{
                    if(r.data.state == true){
                        that.$message({
                            type:'success',
                            message:'登记分数成功！'
                        })
                        that.reload()
                    }
                    else that.$message.error('提交分数失败！')
                }).catch(r=>{
                    that.$message.error('提交分数失败！')
                })
            }
        }
    }
}
</script>