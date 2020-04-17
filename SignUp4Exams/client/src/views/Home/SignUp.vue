<template>
    <div>
        <el-table :data="examData" style="width:100%" v-loading="loading">
            <el-table-column prop="subjectID" label="科目ID" width="100"/>
            <el-table-column prop="subjectName" label="科目名称" width="350"/>
            <el-table-column prop="subjectCost" label="报名费用" width="150"/>
            <el-table-column prop="registerDeadline" label="报名截止日期" width="200"></el-table-column>
            <el-table-column prop="examTime" label="考试时间" width="200"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="submitSignUp(scope.row.subjectID)">报名</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            examData:[],
            token:this.$cookies.get('token'),
            userID:this.$cookies.get('userID'),
            loading:true
        }
    },
    beforeMount () {
        let that = this
        this.$axios.get(this.global.host+'/subjects',{
            params:{
                method:'querySubjAll'
            },
            headers:{'authorization':'Bearer '+this.token}
        }).then(function(r){
            console.log(r.data)
            let subjects = r.data.subjects
            console.log(subjects)
            var s
            for(s of subjects){
                s.registerDeadline = new Date(s.registerDeadline).toLocaleString();
                s.examTime = new Date(s.examTime).toLocaleString();
                //s.examTime = new Date(Date()) > new Date(s.examTime)?1:0
                s.subjectCost += '元'
            }
            that.examData = subjects
            that.loading = false
        })
    },
    methods: {
        submitSignUp(id){
            let that = this
            this.$axios.post(this.global.host+'/subjects/'+id+'/signup',{
                method:'signUpSubj',
                userID:this.userID,
            },{headers:{'authorization':'Bearer '+this.token}}).then(function(r){
                console.log(r.data)
                if(r.data.state == true){
                    that.$message({
                        message:'报名成功！',
                        type:'success'
                    })
                }
                else that.$message.error(r.data.message)
            }).catch(function(r){
                that.$message.error('报名失败')
            })
        }
    }
}
</script>