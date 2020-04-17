<template>
    <div>
        <el-card>
            欢迎您进入后台系统
        </el-card>
        <el-card>
            <div align="center">
                <el-button @click="quit">退出系统</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            username:'辛浩然',
            count:{
                available:0,
                topay:0,
                ready:0,
                ended:0
            }
        }
    },
    methods: {
        quit(){
            this.$cookies.remove('adminToken')
            this.$router.push('/admin')
        }
    }
}
</script>
<style scoped>
.el-card{
    margin-bottom: 10px;
}
.number{
    font-size:25px;
    font-weight: bold;
    color:#0f7fd2;
}
</style>

