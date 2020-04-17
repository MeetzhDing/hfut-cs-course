import React, { Component } from 'react';
import { Card, Button, Form, Input, InputNumber, Radio } from 'antd';
import instance from '../../components/axiosCore';

class UserInfoForm extends Component{
  constructor(props){
    console.log('UserInfoForm constructor');
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let upgradeInfo = {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        for(let item in values){
          if(values[item]!==this.props.userInfo[item]){
            upgradeInfo[item] = values[item]
          }
        }
      }
    })
    if(Object.keys(upgradeInfo).length!==0){
      let token = window.sessionStorage.getItem('token');
      let toSend = Object.assign(upgradeInfo, {method: "updateUserInfo"});
      console.log(toSend);
      instance.put(`/userinfo/${this.props.userInfo.userID}`, toSend, {
        headers: {authorization: `Bearer ${token}`,'Content-Type': 'application/json'}
      },).then(res=>{
        console.log(res.data);
        if(res.data.state===true){
          this.props.afterSubmit({submitFlag: true});
        }
      }).catch(err=>{
        console.log(err);
      })
    } else {
      this.props.afterSubmit({submitFlag: false});
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    let userInfo = this.props.userInfo;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7  },
    };
    return(
      (<Form {...formItemLayout} >
        <Form.Item label="用户ID">
          <span className="ant-form-text">{userInfo.userID}</span>
        </Form.Item>
        <Form.Item label="用户名">
          {getFieldDecorator('username',{
            initialValue: userInfo.username
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="性别">
          {getFieldDecorator('gender',{
            initialValue: userInfo.gender
          })(
            <Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="年龄">
          {getFieldDecorator('age',{
            initialValue: userInfo.age
          })(
            <InputNumber style={{textAlign:"left"}} min={0} max={100} />
          )}
        </Form.Item>
        <Form.Item label="电话">
          {getFieldDecorator('phone',{
            initialValue: userInfo.phone
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>Submit</Button>
        </Form.Item>
      </Form>)
    )
  }
}

const WrappedInfoForm = Form.create({ name: 'UserInfoForm' })(UserInfoForm);

class InfoItem extends Component{
  constructor(props){
    console.log('InfoItem constructor');
    super(props);
    this.state = {
      editStatus: false
    };
  }

  render(){
    let userInfo = this.props.userInfo;
    let content;
    if(this.state.editStatus){
      content = <WrappedInfoForm userInfo={userInfo} afterSubmit={
                  (e)=>{
                    this.setState({editStatus: false})
                    if(e.submitFlag){
                      this.props.callback()
                    }
                  }
                } />;
    } else {
      content = (<div style={{textAlign: "left", fontSize: "20px"}}>
                  <p>用户ID: {userInfo.userID}</p>
                  <p>用户名: {userInfo.username}</p>
                  <p>性别: {userInfo.gender}</p>
                  <p>年龄: {userInfo.age}</p>
                  <p>电话: {userInfo.phone}</p>
                </div>)
    }
    return(
      <Card title="用户信息"  extra={
          this.state.editStatus===false
          ? <Button style={{height: "100%", marginRight: '10px'}} onClick={e => this.setState({editStatus: true})}>编辑</Button>
          : ''
        }>
        {content}
      </Card>
    )
  }
}

export default InfoItem;