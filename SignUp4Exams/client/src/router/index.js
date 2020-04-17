import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Default from '@/views/Home/Default'
import Home from '@/views/Home/Home'
import Profile from '@/views/Home/Profile'
import SignUp from '@/views/Home/SignUp'
import MyExams from '@/views/Home/MyExams'
import adminLogin from '@/views/Admin/Login'
import adminHome from '@/views/Admin/Home/Home'
import adminDefault from '@/views/Admin/Home/Default'
import adminSubjects from '@/views/Admin/Home/Subjects'
import adminUsers from '@/views/Admin/Home/Users'
import adminFinance from '@/views/Admin/Home/Finance'
import adminScores from '@/views/Admin/Home/Scores'
Vue.use(Router)

export default new Router({
  base:'/SignUp4Exams/',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path:'/home',
      name:'Home',
      component:Home,
      children:[
        {
          path:'/home/default',
          name:'Default',
          component:Default
        },
        {
          path:'/home/profile',
          name:'Profile',
          component:Profile
        },
        {
          path:'/home/signup',
          name:'SignUp',
          component:SignUp
        },
        {
          path:'/home/myexams',
          name:'MyExams',
          component:MyExams
        },
      ]
    },
    {
      path:'/admin',
      name:'adminLogin',
      component:adminLogin,
    },
    {
      path:'/admin/home',
      name:'adminHome',
      component:adminHome,
      children:[
        {
        path:'/admin/home/default',
        name:'adminDefault',
        component:adminDefault
      },{
        path:'/admin/home/subjects',
        name:'adminSubjects',
        component:adminSubjects
      },{
        path:'/admin/home/users',
        name:'adminUsers',
        component:adminUsers
      },{
        path:'/admin/home/finance',
        name:'adminFinance',
        component:adminFinance
      },{
        path:'/admin/home/scores',
        name:'adminScores',
        component:adminScores
      }]
    }
  ]
})
