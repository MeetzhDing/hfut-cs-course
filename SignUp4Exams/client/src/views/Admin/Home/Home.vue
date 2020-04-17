<template>
  <div v-if="show">
    <el-container class="all">
      <el-header>
            <div class="title"><span>在线报考后台管理系统</span></div>
      </el-header>
      <el-container>
        <el-aside width="12%">
            <el-menu router=true default-active="1" background-color="#f0f8fc">
                <el-menu-item index="/admin/home/default">
                    <i class="el-icon-location" style="margin-bottom:3px"></i>首页
                </el-menu-item>
                <el-menu-item index="/admin/home/users">
                  <i class="el-icon-edit" style="margin-bottom:3px"></i>用户管理
                </el-menu-item>
                <el-menu-item index="/admin/home/subjects"><i class="el-icon-document" style="margin-bottom:3px"></i>科目管理</el-menu-item>
                <el-menu-item index="/admin/home/finance"><i class="el-icon-goods" style="margin-bottom:3px"></i>财务管理</el-menu-item>
            </el-menu>
        </el-aside>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.all{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #2a83cf;
}
.el-header{text-align: left;float: left;}
.el-aside{background-color:#f0f8fc;}
.el-main{background-color:#fafafa;text-align: left;}
.el-menu{padding: 5px}
.el-submenu .el-menu-item{font-size:10px;}
.title{font-size: 20px;color:white;line-height: 60px;display: inline;}

</style>

<script>
export default {
  data () {
    return {
      adminToken : this.$cookies.get('adminToken'),
      show:false
    }
  },
  beforeMount () {
    let that = this
    this.$axios.get(this.global.host+'/admin/verify',{
      headers:{'authorization':'Bearer '+this.adminToken}}).then((r)=>{
        if(r.data.state != true){
          that.$router.push('/admin')
          that.$router.go(0)
        }
        that.show = true
      }).catch((r)=>{
        console.log('失败')
        that.$router.push('/admin')
        that.$router.go(0)
      })
  }
}
</script>
