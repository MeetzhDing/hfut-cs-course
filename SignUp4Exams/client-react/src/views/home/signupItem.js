import React, { Component } from 'react';
import { Card, Table, Button, message } from 'antd';

import instance from '../../components/axiosCore';

class SignUpItem extends Component{

  handleSignUp = (record, e) => {
    let userSubject = this.props.userSubject;
    let subject = userSubject.find((item)=>{
      return(item.subjectID===record.subjectID)
    })
    if(subject){
      message.error('已报名');
    } else if(new Date()>new Date(record.registerDeadline)){
      message.error('报名截止时间已过');
    } else {
      let token = window.sessionStorage.getItem('token');
      instance.post(`/subjects/${record.subjectID}/signup`,{
        userID: this.props.userInfo.userID,
        method: 'signUpSubj'
      },{
        headers: {authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}
      }).then(res=>{
        if(res && res.data && res.data.state){
          message.success('报名成功');
          this.props.callback();
        } else {
          message.info(res.data.message);
        }
      }).catch(err=>{
        console.log(err);
      })
    }
  }

  render(){
    const { Column } = Table;

    return (
      <Card>
        <Table rowKey="subjectID" dataSource={this.props.subjects} pagination={ false } >
          <Column title="科目ID" dataIndex="subjectID" key="subjectID" />
          <Column title="科目名称" dataIndex="subjectName" key="subjectName" />
          <Column title="报名费用" dataIndex="subjectCost" key="subjectCost" />
          <Column title="报名截止日期" dataIndex="registerDeadline" key="registerDeadline" render={(text)=>{return new Date(text).toLocaleString()}} />
          <Column title="考试时间" dataIndex="examTime" key="examTime" render={(text)=>{return new Date(text).toLocaleString()}} />
          <Column
            title="操作"
            key="action"
            render={(text, record) => (
              <Button onClick={(e) => this.handleSignUp(record, e)}>报名</Button>
            )}
          />
        </Table>
      </Card>
    )
  }
}

export default SignUpItem;