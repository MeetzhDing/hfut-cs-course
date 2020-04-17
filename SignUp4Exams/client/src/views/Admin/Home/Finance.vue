<template>
    <div>
        <el-card>
            <el-table :data="tradesData" style="width:100%" v-loading="loading">
                <el-table-column prop="outTradeId" label="订单号" width="200"/>
                <el-table-column prop="userID" label="用户ID" width="300"/>
                <el-table-column prop="subjectName" label='科目' width="170"/>
                <el-table-column prop="amount" label='金额' width="80"/>
                <el-table-column prop="completed" label="是否支付" width="80"/>
                <el-table-column prop='payTime' label='支付时间' />
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            tradesData:[],
            adminToken:this.$cookies.get('adminToken'),
            loading:true
        }
    },
    beforeMount () {
        let that = this
        this.$axios.get(this.global.host+'/admin/trades',{
            params:{
                method:'queryTrades',
            },
            headers:{
                'authorization':'Bearer '+this.adminToken
            }
        }).then(r=>{
            console.log(r.data)
            that.tradesData = r.data.trades
            var t
            for(t of that.tradesData){
                t.amount += '元'
                t.completed = t.completed==1?'是':'否'
                t.payTime = t.payTime == null?'无':new Date(t.payTime).toLocaleString()
            }
            that.loading = false
        }).catch(r=>{
            that.$message.error('获取交易信息失败')
            console.log(r)
        })
    }
}
</script>
