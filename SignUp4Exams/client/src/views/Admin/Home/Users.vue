<template>
    <div>
        <el-card>
            <el-table :data="userData.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))" style="width:100%" v-loading="loading">
                <el-table-column prop="userID" label="ID" width="300"/>
                <el-table-column prop="email" label="邮箱" width="170"/>
                <el-table-column prop="username" label='姓名' width="100"/>
                <el-table-column prop="gender" label='性别' width="60"/>
                <el-table-column prop="age" label="年龄" width="80"/>
                <el-table-column prop='phone' label='电话号码' />
                <el-table-column align="right">
                    <template slot="header" slot-scope="scope">
                        <el-input v-model="search" size="mini" placeholder="输入姓名搜索" />
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            userData:[],
            adminToken:this.$cookies.get('adminToken'),
            loading:true,
            search:''
        }
    },
    beforeMount () {
        let that = this
        this.$axios.get(this.global.host+'/userinfo',{
            params:{
                method:'queryUserInfoAll'
            },
            headers:{'authorization':'Bearer '+this.adminToken}
        }).then(r=>{
            if(r.data.state == true){
                that.userData = r.data.userinfo
            }
            var u
            for(u of that.userData){
                u.gender = u.gender == 'm'?'男':'女'
            }
            that.loading = false
        }).catch(r=>{
            console.log(r)
        })
    }
}
</script>

