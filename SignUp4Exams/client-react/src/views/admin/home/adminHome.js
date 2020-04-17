import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Icon, Layout, Menu, Button } from 'antd';
import './adminHome.scss';

import IndexItem from './indexItem';
import UserInfo from './userItem';
import SubjectItem from './subjectItem';
import PaymentItem from './paymentItem';
import RegScore from './regScore';

import { connect } from 'react-redux';


import {
  queryInfoRequest,
  logout
} from '../../../redux/actions';

const mapStateToProps = state => {
  return {
    state: state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    queryInfo: payload => {
      dispatch( queryInfoRequest(payload) )
    },
    doLogout: () => {
      dispatch( logout() )
    }
  }
}

const { Header, Content, Sider } = Layout;

class AdminHome extends Component{

  constructor(props){
    super(props);
    this.state = {
      menuItem: 'index'
    }
  }

  componentDidMount(){
    this.props.queryInfo('ALL');
  }

	render(){
    let state = this.props.state;
    if(!(state && state.session && state.session.token)){
      return(
        <Redirect to='/admin' />
      )
    }
    let content;

    switch(this.state.menuItem){
      case 'index':
        content = <IndexItem session={state.session} />;
        break;
      case 'user':
        content = <UserInfo userinfo={state.data.userinfo}></UserInfo>;
        break;
      case 'subjects':
        content = <SubjectItem ></SubjectItem>;
        break;
      case 'payment':
        content = <PaymentItem trades={state.data.trades}></PaymentItem>;
        break;
      case 'setScore':
        content = <RegScore ></RegScore>;
        break;
      default:
        content = null;
        break;
    }

		return(
      <Layout className="home-layout">
        <Header className="home-header" >
          <span className="header-title">考试报名查分系统</span>
          <span className="header-logout"><Button onClick={this.props.doLogout}>注销</Button></span>
        </Header>
        <Layout>
          <Sider width={'200px'} className="home-sider" >
            <Menu
              mode="inline"
              defaultSelectedKeys={['menu-index']}
              defaultOpenKeys={['sub1']}
              className="sider-menu"
            >
              <Menu.Item key="menu-index" onClick={ () => this.setState({ menuItem: 'index'}) }><span><Icon type="home" />首页</span></Menu.Item>
              <Menu.Item key="menu-user" onClick={ () => this.setState({ menuItem: 'user'}) }><span><Icon type="usergroup-add" />用户管理</span></Menu.Item>
              <Menu.Item key="menu-subject" onClick={ () => this.setState({ menuItem: 'subjects'}) }><span><Icon type="unordered-list" />科目管理</span></Menu.Item>
              <Menu.Item key="menu-payment" onClick={ () => this.setState({ menuItem: 'payment'}) }><span><Icon type="pay-circle" />缴费情况</span></Menu.Item>
              <Menu.Item key="menu-set-score" onClick={ () => this.setState({ menuItem: 'setScore'}) }><span><Icon type="form" />登记分数</span></Menu.Item>
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



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminHome);
