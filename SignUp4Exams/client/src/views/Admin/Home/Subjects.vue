<template>
    <div>
        <el-card>
            <el-button @click="createVisible = true">新增科目</el-button>
            <el-table :data='subjectData.filter(data => !search || data.subjectName.toLowerCase().includes(search.toLowerCase()))' style="width:100%" v-loading="loading">
                <el-table-column sortable prop="subjectID" label="科目ID" width="100"/>
                <el-table-column prop="subjectName" label="科目名称" width="170"/>
                <el-table-column sortable prop="subjectCost" label="报名费用" width="150"/>
                <el-table-column sortable prop="registerDeadline" label="报名截止日期" width="200"></el-table-column>
                <el-table-column sortable prop="examTime" label="考试时间" width="200"></el-table-column>
                <el-table-column label="操作">
                    <template slot="header" slot-scope="scope">
                        <el-input v-model="search" size="mini" placeholder="输入科目搜索" style="width:200px"/>
                    </template>
                    <template scope="scope">
                        <el-button size="small" @click="deleteSubj(scope.row.subjectName)">删除科目</el-button>
                        <el-button size="small" @click="submitScore(scope.row.subjectID)">登记分数</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog class="createDialog" title="新增科目" :visible.sync="createVisible" width="25%">
            <el-input v-model="newSubject.Name" maxlength='10' placeholder="科目名称" size="medium"></el-input>
            <el-input v-model="newSubject.Cost" maxlength='5' onkeyup="value=value.replace(/[^0-9]/g,'')" placeholder="报名费用（元，<99999）" size="medium"></el-input>
            <el-date-picker 
                v-model="newSubject.deadline" 
                type="datetime" placeholder="选择报名截止时间" align="center"
                style="width:100%" size="medium"
                value-format="yyyy-MM-dd HH:mm:ss"/>
            <el-date-picker 
                v-model="newSubject.examTime" 
                type="datetime" placeholder="选择考试时间" align="center"
                style="width:100%" size="medium"
                value-format="yyyy-MM-dd HH:mm:ss"/>
            <div align="center" style="margin-top:5px"><el-button @click="createSubject">添加</el-button></div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    inject:['reload'],
    data () {
        return {
            subjectData:[],
            loading:true,
            adminToken:this.$cookies.get('adminToken'),
            createVisible:false,
            newSubject:{
                Name:'',
                Cost:'',
                deadline:'',
                examTime:'',
            },
            search:''
        }
    },
    beforeMount () {
        let that = this
        this.$axios.get(this.global.host+'/subjects',{
            params:{
                method:'querySubjAll'
            },
            headers:{'authorization':'Bearer '+this.adminToken}
        }).then(r=>{
            let subjects = r.data.subjects
            console.log(subjects)
            var s
            for(s of subjects){
                s.registerDeadline = new Date(s.registerDeadline).toLocaleString();
                s.examTime = new Date(s.examTime).toLocaleString();
                s.subjectCost += '元'
            }
            that.subjectData = subjects
            that.loading = false
        })
    },
    methods: {
        createSubject(){
            let that = this
            if(this.newSubject.Name == ''||this.newSubject.Cost==''||this.newSubject.deadline == ''||this.newSubject.examTime==''){
                this.$message.error('请填写完整的数据')
            }
            else if(/[^a-zA-Z0-9\u4E00-\u9FA5]/g.test(this.newSubject.Name)){
                this.$message.error('科目名称不合法（仅中文、英文、数字）')
            }
            else{
                this.$axios.post(this.global.host+'/subjects/',{
                    method:'addSubj',
                    subjectName:this.newSubject.Name,
                    subjectCost:this.newSubject.Cost,
                    registerDeadline:this.newSubject.deadline,
                    examTime:this.newSubject.examTime,
                },{headers:{'authorization':'Bearer '+this.adminToken}}).then(r=>{
                    if(r.data.state == true){
                        that.$message({
                            message:'科目添加成功',
                            type:'success'
                        })
                        that.reload()
                    }
                    else{
                        that.$message.error('科目添加失败')
                    }
                }).catch(r=>{
                    that.$message.error('未知错误')
                })        
            }
        },
        submitScore(id,time){
            console.log(id)
            this.$router.push({name:'adminScores',params:{id:id}})
        },
        deleteSubj(name){
            let that = this
            this.$confirm('确定要删除该科目吗？','确认',{
                confirmButtonText:'确定',
                cancelButtonText:'取消'
            }).then(r=>{
                that.$axios.delete(that.global.host+'/subjects',{
                    data:{
                        subjectName:name,
                        method:'deleteSubj'
                    },
                    headers:{'authorization':'Bearer '+that.adminToken}}).then(r=>{
                    console.log(r.data)
                    if(r.data.state == true){
                        that.$message({
                            type:'success',
                            message:'删除成功'
                        })
                    }
                    else that.$message.error('删除失败')
                    that.reload()
                }).catch(r=>{
                    console.log(r)
                    that.$message.error('删除失败')
                })
            })
        }
    }
}
</script>

<style>
.el-dialog .el-input {
    padding: 10px;
    margin-left:-10px;
}
</style>
