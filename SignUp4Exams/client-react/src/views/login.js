import React, { Component } from 'react'
import './login.scss'
import { Form, Icon, Input, Button, Checkbox, message} from 'antd';
import instance from '../components/axiosCore';
import { Redirect } from 'react-router-dom';
import WrappedRegisterForm from './wrappedRegisterForm';
import WrappedResetPasswordForm from './wrappedResetPasswordForm';

class LoginForm extends React.Component {
  constructor(props){
    console.log('login constructor');
    super(props);
    this.state = {
      redirectFlag: false,
      modalContent: ''
    }
  }

  componentDidMount(){
    console.log('login componentDidMount')
    let email = window.sessionStorage.getItem('email');
    let token = window.sessionStorage.getItem('token');
    let userID = window.sessionStorage.getItem('userID');
    if(email && token && userID){
      instance.get(`/userinfo/${userID}`, {
        params: { method: 'queryUserInfo' },
        headers: { authorization: `Bearer ${token}`}
      }).then(res=>{
        console.log(res.data);
        if(res && res.data && res.data.state === true){
          this.setState({ redirectFlag: true })
        }
      }).catch(err=>{
        console.log(err);
      })
    } else {
      email = window.localStorage.getItem('email');
      token = window.localStorage.getItem('token');
      userID = window.localStorage.getItem('userID');
      if(email && token && userID){
        instance.get(`/userinfo/${userID}`, {
          params: { method: 'queryUserInfo' },
          headers: { authorization: `Bearer ${token}`}
        }).then(res=>{
          console.log(res.data);
          if(res && res.data && res.data.state === true){
            window.sessionStorage.setItem('email', email);
            window.sessionStorage.setItem('token', token);
            window.sessionStorage.setItem('userID', userID);
            this.setState({ redirectFlag: true })
          }
        }).catch(err=>{
          console.log(err);
        })
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    const { getFieldsValue } = this.props.form;
    let values = getFieldsValue(['email', 'password', 'remember']);
    instance.get('/users', {
      params: {
        method: 'userLogin',
        email: values.email,
        password: values.password
      }
    }).then(res=>{
      let data = res.data;
      if(data && data.state === true && data.token && data.userID){
        message.success('登录成功');
        window.sessionStorage.setItem('email', values.email);
        window.sessionStorage.setItem('token', data.token);
        window.sessionStorage.setItem('userID', data.userID);
        if(values.remember){
          window.localStorage.setItem('email', values.email);
          window.localStorage.setItem('token', data.token);
          window.localStorage.setItem('userID', data.userID);
        }
        this.setState({redirectFlag: true});
      } else if(data && data.message === 'wrong password'){
        message.info('密码错误');
      }
    }).catch(err=>{
      console.log(err);
      message.error('登录错误');
    })
  }

  userRegister = (e) => {
    let form = this.formRef.props.form;
    let values = form.getFieldsValue();
    console.log(form.getFieldsValue());
    let token = window.sessionStorage.getItem('token');
    instance.post('/users', {
      method: 'userReg',
      email: `${values.email}`,
      password: `${values.password}`,
      username: `${values.username}`
    }, {
      headers: {authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}
    }).then(res=>{
      console.log(res.data)
      if(res && res.data && res.data.state){
        message.info('注册成功！');
        this.setState({ modalContent: ''});
      } else {
        if(res.data.message === 'user registered'){
          message.info('用户已注册')
        } else {
          message.info(res.data.message);
        }
      }
    }).catch(err=>{
      console.log(err);
    })
  }

  resetPassword = (e) => {
    let form = this.formRef.props.form;
    let values = form.getFieldsValue();
    console.log(form.getFieldsValue());
    instance.get('/users/forgetPassword', {
      params: {
        method: 'forgetPwd',
        email: `${values.email}`
      }
    }).then(res=>{
      console.log(res.data)
      if(res && res.data && res.data.state){
        message.info('重置密码邮件已发出');
        this.setState({ modalContent: ''});
      } else {
        if(res.data.message === 'email not registered'){
          message.info('邮箱未注册')
        } else {
          message.info(res.data.message);
        }
      }
    }).catch(err=>{
      console.log(err);
    })
  }

  render() {
    if(this.state.redirectFlag){
      return( <Redirect to="/home" /> )
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input prefix={<Icon type="mail" className="login-input" />} placeholder="Email" />
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
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Remember me</Checkbox>
            )}
            <Button className="login-form-forget link-button" type="link" onClick={()=>{this.setState({modalContent: 'resetPassword'})}}>Forget password</Button>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <Button className="link-button" type="link" onClick={()=>{this.setState({modalContent: 'register'})}}>register now!</Button>
          </Form.Item>
        </Form>

        <WrappedRegisterForm
          wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
          visible={this.state.modalContent==='register'}
          onCancel={()=>{this.setState({modalContent: ''})}}
          onCreate={this.userRegister}
        />
        <WrappedResetPasswordForm
          wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
          visible={this.state.modalContent==='resetPassword'}
          onCancel={()=>{this.setState({modalContent: ''})}}
          onCreate={this.resetPassword}
        />

      </React.Fragment>
    );
  }
}

const WrappedLoginForm = Form.create({ name: 'normal_login' })(LoginForm);



class Login extends Component {
  render(){
    return(
      <div id='page'>
        <div id='loginWarp'>
          <h2 id="loginTitle">考试报名查分系统</h2>
          <div id="loginInfo">
            <WrappedLoginForm />
          </div>
        </div>
      </div>
    );
  }
}

export default Login;