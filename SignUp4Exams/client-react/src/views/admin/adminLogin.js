import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Redirect } from 'react-router-dom';
import './adminLogin.scss'

import { connect } from 'react-redux'
import { loginRequest, loginVerifyRequest } from '../../redux/actions';

const mapStateToProps = state => {
  return {
    state: state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoginClick: payload => {
      dispatch(loginRequest(payload))
    },
    loginVerify: payload => {
      dispatch(loginVerifyRequest(payload))
    }
  }
}

class AdminLoginForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    const { getFieldsValue } = this.props.form;
    let values = getFieldsValue(['username', 'password']);
    this.props.onLoginClick(values)
  }

  componentDidMount(){
    let adminToken = window.localStorage.getItem('adminToken');
    let adminUsername = window.localStorage.getItem('adminUsername');
    if( adminToken && adminUsername ){
      this.props.loginVerify({ token: adminToken, username: adminUsername })
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    let state = this.props.state;
    if(state && state.session && state.session.token){
      return(
        <Redirect to='/admin/home'></Redirect>
      )
    }

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="user" className="login-input" />} placeholder="administrator" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" className="login-input" />} type="password" placeholder="Password" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </React.Fragment>
    )
  }
}

const WrappedAdminLoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: 'admin_login' })(AdminLoginForm))

class AdminLogin extends React.Component {
  render(){
    return(
      <div id='page'>
        <div id='loginWarp'>
          <h2 id="loginTitle">后台管理系统</h2>
          <div id="loginInfo">
            <WrappedAdminLoginForm />
          </div>
        </div>
      </div>
    );
  }
}

export default AdminLogin;