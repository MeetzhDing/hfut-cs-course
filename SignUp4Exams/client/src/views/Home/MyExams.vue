<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane label="未缴费">
                <el-table :data="tableData.toPay" style="width:100%">
                    <el-table-column prop="subjectID" label="科目ID" width="100"/>
                    <el-table-column prop="subjectName" label="科目名称" width="300"/>
                    <el-table-column prop="subjectCost" label="报名费用" width="100"/>
                    <el-table-column prop="registerDeadline" label="缴费截止时间" width="200"/>
                    <el-table-column label="状态" width="100"><span style="color:red">待缴费</span></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" @click="pay(scope.row)">缴费</el-button>
                            <el-button size="small" @click="cancelSignUp(scope.row)">取消报名</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="待考试">
                <el-table :data="tableData.ready">
                    <el-table-column prop="subjectID" label="科目ID" width="100"/>
                    <el-table-column prop="subjectName" label="科目名称" width="300"/>
                    <el-table-column prop="examTime" label="考试时间" width="200"/>
                    <el-table-column label="状态"><span style="color:blue">待考试</span></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="已结束">
                <el-table :data="tableData.ended">
                    <el-table-column prop="subjectID" label="科目ID" width="100"/>
                    <el-table-column prop="subjectName" label="科目名称" width="300"/>
                    <el-table-column label="状态" width="100"><span style="color:green">已结束</span></el-table-column>
                    <el-table-column prop="score" label="分数"/>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            title="支付报名费用"
            :visible.sync="payVisible"
            width="30%">
            <div>
                <div align="center">
                    <span>请在打开的新窗口中完成支付，支付一经成功，概不退款！</span>
                </div>
                <div align="center" style="margin-top:20px">
                    <el-button type="success" @click="completePay">我已完成支付</el-button>
                </div>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
export default {
    inject:['reload'],
    data () {
        return {
            rawData:[],
            tableData:{
                toPay:[],
                ready:[],
                ended:[]
            },
            token:this.$cookies.get('token'),
            userID:this.$cookies.get('userID'),
            payVisible:false,
            outTradeId:''
        }
    },
    methods: {
        cancelSignUp(row){
            let that = this
            this.$axios.delete(this.global.host+'/subjects/cancelSignUp',{
                data:{
                    method:'cancelSubjSign',
                    subjectName:row.subjectName,
                    userID:this.userID
                },
                headers:{'authorization':'Bearer '+this.token}
            }).then(r=>{
                if(r.data.state == true){
                    that.$message({
                        message:'取消考试成功！',
                        type:'success'
                    })
                    that.reload()
                }
                else that.$message.error('取消考试失败！')
            }).catch(r=>{
                that.$message.error('取消考试失败！')
            })
        },
        pay(row){
            let that = this
            this.$axios.post(this.global.host+'/pay/trade',{
                method:'createTrade',
                userID:this.userID,
                subjectID:row.subjectID
            },{headers:{'authorization':'Bearer '+this.token}}).then(r=>{
                that.outTradeId = r.data.outTradeId
                if(r.data.state == true){
                    window.open(r.data.tradeLink)
                    this.payVisible = true
                }
                else that.$message.error('创建支付订单失败！')
            }).catch(r=>{
                console.log(r)
                that.$message.error('创建支付订单失败！')
            })
        },
        completePay(){
            let that = this
            this.$axios.get(this.global.host+'/pay/trade',{
                params:{
                    outTradeId:this.outTradeId,
                    method:'queryTrade'
                },
                headers:{
                    'authorization':'Bearer '+this.token
                }
            }).then(r=>{
                if(r.data.state == true && r.data.tradeInfo.completed == true){
                    that.$message({
                        message:'支付成功！',
                        type:'success'
                    })
                    that.reload()
                }
                else that.$message.error('未查询到支付成功，请继续完成支付')
            }).catch(r=>{
                that.$message.error('未知错误，查询失败')
            })
        },
    },
    beforeMount () {
        let that = this
        this.$axios.get(this.global.host+'/userinfo/'+this.userID+'/subjects',{
            params:{
                method:'queryUserSubj',
                userID:this.userID
            },
            headers:{'authorization':'Bearer '+this.token}
        }).then(function(r){
            if(r.data.state == true){
                that.rawData = r.data.subjects
            }
           console.log(that.rawData)
           var s
            for(s of that.rawData){
                console.log(s)
                if(s.payment == false) {
                    s.registerDeadline = new Date(s.registerDeadline).toLocaleString();
                    that.tableData.toPay.push(s)
                }
                if(s.payment == true && (new Date(Date()) < new Date(s.examTime))) {
                    that.tableData.ready.push(s)
                    s.examTime = new Date(s.examTime).toLocaleString();
                }
                if(s.payment == true && (new Date(Date()) > new Date(s.examTime))) that.tableData.ended.push(s)
                if(s.score == null) s.score = '暂未出分'
            }
        }).catch((r)=>{
            console.log(r)
        })
    }
}
</script>
