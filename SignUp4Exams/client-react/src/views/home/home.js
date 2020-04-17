import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Icon, Layout, Menu, Button, message } from 'antd';
import IndexItem from './indexItem';
import InfoItem from './infoItem';
import SignupItem from './signupItem';
import MyExamItem from './myexamItem';
import instance from '../../components/axiosCore';
import './home.scss';

const { Header, Content, Sider } = Layout;

class Home extends Component{
	constructor(props){
    console.log('Home constructor');
    super(props);
    this.state = {
      menuItem: 'index',
      updateFlag: false,
      redirectFlag: false,
      email: '',
      token: '',
      userID: '',
      userInfo: {},
      subjects: [],
      userSubject: []
    }
	}

  componentDidMount(){
    console.log('Home componentDidMount');
    let email = window.sessionStorage.getItem('email');
    let token = window.sessionStorage.getItem('token');
    let userID = window.sessionStorage.getItem('userID');
    if(email && token && userID){
      let userInfoPromise = instance.get(`/userinfo/${userID}`, {
        params: { method: 'queryUserInfo' },
        headers: {authorization: `Bearer ${token}`}
      })
      let subjectsPromise = instance.get('/subjects', {
        params: { method: 'querySubjAll' },
        headers: {authorization: `Bearer ${token}`}
      })
      let userSubjectPromise = instance.get(`/userInfo/${userID}/subjects`, {
        params: { method: 'queryUserSubj' },
        headers: {authorization: `Bearer ${token}`}
      })
      Promise.all([userInfoPromise,subjectsPromise, userSubjectPromise]).then(res => {
        let flag = res.every(item=>{
          if(item && item.data && item.data.state){
            return true;
          } else return false;
        })
        console.log(res, flag);
        if(flag){
          this.setState({
            email: email,
            token: token,
            userID: userID,
            userInfo: res[0].data,
            subjects: res[1].data.subjects,
            userSubject: res[2].data.subjects
          })
        } else{
          // 如果请求内容状态有问题，通过setState方式重新发出请求，转入componentDidUpdate
          this.setState({email: email, token: token, userID: userID})
        }
      }).catch(err=> {
        console.log(err);
        message.info('请重新登陆');
        window.sessionStorage.clear();
        window.localStorage.clear();
        this.setState({redirectFlag: true});
      });
    } else {
      this.setState({ redirectFlag: true })
    }
  }

  componentDidUpdate(){
    console.log('Home componentDidUpdate');
    // 如果页面即将跳转，或数据不需要更新，则什么都不做
    if(this.state.redirectFlag || !this.state.updateFlag) return;

    let email = window.sessionStorage.getItem('email');
    let token = window.sessionStorage.getItem('token');
    let userID = window.sessionStorage.getItem('userID');
    if(email && token && userID){
      let userInfoPromise = instance.get(`/userinfo/${userID}`, {
        params: { method: 'queryUserInfo' },
        headers: {authorization: `Bearer ${token}`}
      })
      let subjectsPromise = instance.get('/subjects', {
        params: { method: 'querySubjAll' },
        headers: {authorization: `Bearer ${token}`}
      })
      let userSubjectPromise = instance.get(`/userInfo/${userID}/subjects`, {
        params: { method: 'queryUserSubj' },
        headers: {authorization: `Bearer ${token}`}
      })
      Promise.all([userInfoPromise,subjectsPromise, userSubjectPromise]).then(res => {
        let flag = res.every(item=>{
          if(item && item.data && item.data.state){
            return true;
          } else return false;
        })
        console.log(res, flag);
        if(flag){
          this.setState({
            email: email,
            token: token,
            userID: userID,
            userInfo: res[0].data,
            subjects: res[1].data.subjects,
            userSubject: res[2].data.subjects,
            updateFlag: false
          })
        }
      }).catch(err=> {
        console.log(err);
        message.info('请重新登陆');
        window.sessionStorage.clear();
        window.localStorage.clear();
        this.setState({redirectFlag: true});
      });
    } else {
      this.setState({ redirectFlag: true })
    }
  }

  accountLogout = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    message.info("注销成功!");
    this.setState({redirectFlag: true});
  }

	render(){
    if(this.state.redirectFlag){
      return(
        <Redirect to='/' />
      )
    }
    let content;
    if(!this.state.updateFlag && this.state.menuItem){
      switch(this.state.menuItem){
        case 'index':
          content = <IndexItem userInfo={this.state.userInfo} userSubject={this.state.userSubject} />;
          break;
        case 'info':
          content = <InfoItem userInfo={this.state.userInfo} callback={()=>{this.setState({updateFlag: true})}}/>;
          break;
        case 'signup':
          content = <SignupItem userInfo={this.state.userInfo} subjects={this.state.subjects} userSubject={this.state.userSubject} callback={()=>{this.setState({updateFlag: true})}}/>
          break;
        case 'myexam':
          content = <MyExamItem userInfo={this.state.userInfo} userSubject={this.state.userSubject} callback={()=>{this.setState({updateFlag: true})}} />
          break;
        default:
          content = null;
          break;
      }
    }
		return(
      <Layout className="home-layout">
        <Header className="home-header" >
          <span className="header-title">考试报名查分系统</span>
          <span className="header-logout"><Button onClick={this.accountLogout}>注销</Button></span>
        </Header>
        <Layout>
          <Sider width={'200px'} className="home-sider" >
            <Menu
              mode="inline"
              defaultSelectedKeys={['menu-index']}
              defaultOpenKeys={['sub1']}
              className="sider-menu"
            >
              <Menu.Item key="menu-index" onClick={() => this.setState({menuItem: 'index'})}><span><Icon type="home" />首页</span></Menu.Item>
              <Menu.Item key="menu-info" onClick={() => this.setState({menuItem: 'info'})}><span><Icon type="idcard" />个人信息</span></Menu.Item>
              <Menu.Item key="menu-signup" onClick={() => this.setState({menuItem: 'signup'})}><span><Icon type="form" />考试报名</span></Menu.Item>
              <Menu.Item key="menu-myexam" onClick={() => this.setState({menuItem: 'myexam'})}><span><Icon type="unordered-list" />我的考试</span></Menu.Item>
            </Menu>
          </Sider>
          <Layout className="content-layout">
            <Content className="home-content">
              {content}
            </Content>
          </Layout>
        </Layout>
      </Layout>
		)
	};
}



export default Home;
