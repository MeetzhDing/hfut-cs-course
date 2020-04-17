import React, { Component } from 'react';
import { Tabs, Table, Button, message, Card, Modal } from 'antd';
import memoize from "memoize-one";
import instance from '../../components/axiosCore';

const TabPane = Tabs.TabPane;
const { Column } = Table;


class MyEaxmItem extends Component {
  constructor(props){
    console.log('MyEaxmItem constructor');
    super(props);
    this.state = {
      paymentModelVisible: false,
      tradeLink: '',
      outTradeId: '',
      token: window.sessionStorage.getItem('token')
    }
  }

  subjTransfer = memoize(
    (subjects) => {
      let [toPaySubject, examSubject, completedSubject] = [[],[],[]]
      subjects.forEach(subj => {
        if(subj.payment===0){
          toPaySubject.push(subj);
        } else if(new Date()<new Date(subj.registerDeadline)){
          examSubject.push(subj);
        } else {
          completedSubject.push(subj);
        }
      })
      return({ toPaySubject, examSubject, completedSubject })
    }
  );

  handlePayment = (record, e) => {
    console.log(record, e);
    instance.post('/pay/trade', {
      method: 'createTrade',
      userID: this.props.userInfo.userID,
      subjectID: record.subjectID
    }, {
      headers: {authorization: `Bearer ${this.state.token}`, 'Content-Type': 'application/json'}
    }).then(res=>{
      console.log(res.data)
      window.open(res.data.tradeLink);
      this.setState({
        outTradeId: res.data.outTradeId,
        tradeLink: res.data.tradeLink,
        paymentModelVisible: true
      })
    }).catch(err=>{
      console.log(err);
      message.info('创建订单失败');
    })
  }

  handleCancelSignup = (record, e) => {
    console.log(record, e);
    instance.delete('/subjects/cancelSignUp',{
      data: {
        method: 'cancelSubjSign',
        subjectName: record.subjectName,
        userID: this.props.userInfo.userID
      },
      headers: {authorization: `Bearer ${this.state.token}`, 'Content-Type': 'application/json'}
    }).then(res=>{
      console.log(res);
      if(res && res.data && res.data.state){
        message.info('取消报名成功');
        this.props.callback();
      }
    }).catch(err=>{
      console.log(err);
    })
  }

  checkTradeStatus = () => {
    if(this.state.tradeLink === '' || this.state.outTradeId === ''){
      this.setState({paymentModelVisible: false})
      return;
    }
    instance.get('/pay/trade', {
      params: {
        method: 'queryTrade',
        outTradeId: this.state.outTradeId
      },
      headers: {authorization: `Bearer ${this.state.token}`}
    }).then(res=>{
      console.log(res);
      if(res && res.data && res.data.state && res.data.tradeInfo){
        if (res.data.tradeInfo.completed) {
          message.info('支付成功');
          this.setState({
            paymentModelVisible: false,
            outTradeId: '',
            tradeLink: ''
          });
          this.props.callback();
        } else {
          message.error('状态查询失败，请稍后重试');
        }
      }
    }).catch(err=>{
      console.log(err);
      message.error(err);
    })
  }

  paymentTabPane = (subjects) => {
    return (
      <React.Fragment>
        <Table rowKey="subjectID" dataSource={subjects} pagination={ false } >
          <Column title="科目ID" dataIndex="subjectID" key="subjectID" />
          <Column title="科目名称" dataIndex="subjectName" key="subjectName" />
          <Column title="报名费用" dataIndex="subjectCost" key="subjectCost" />
          <Column title="缴费截止日期" dataIndex="registerDeadline" key="registerDeadline" render={(text)=>{return new Date(text).toLocaleString()}} />
          <Column
            title="操作"
            key="action"
            render={(text, record) => (
              <span>
                <Button onClick={(e) => this.handlePayment(record, e)}>缴费</Button>
                <Button onClick={(e) => this.handleCancelSignup(record, e)}>取消报名</Button>
              </span>
            )}
          />
        </Table>
        <Modal title="支付报名费用"
          visible={this.state.paymentModelVisible}
          onOk={this.checkTradeStatus}
          onCancel={ ()=>{this.setState({'paymentModelVisible': false})} }
          footer={[
            <Button key="submit" type="primary" onClick={this.checkTradeStatus}>
              我已完成支付
            </Button>,
          ]}
        >
          <p>请在打开的新窗口中完成支付，支付一经成功，概不退款！</p>
        </Modal>
      </React.Fragment>
    )
  }

  examTabPane = (subjects) => {
    return (
      <Table rowKey="subjectID" dataSource={subjects} pagination={ false } >
        <Column title="科目ID" dataIndex="subjectID" key="subjectID" />
        <Column title="科目名称" dataIndex="subjectName" key="subjectName" />
        <Column title="考试日期" dataIndex="examTime" key="examTime" render={
          (text)=>{ return new Date(text).toLocaleString() }
        }/>
      </Table>
    )
  }

  completedTabPane = (subjects) => {
    return (
      <Table rowKey="subjectID" dataSource={subjects} pagination={ false } >
        <Column title="科目ID" dataIndex="subjectID" key="subjectID" />
        <Column title="科目名称" dataIndex="subjectName" key="subjectName" />
        <Column title="考试日期" dataIndex="examTime" key="examTime" render={
          (text)=>{ return new Date(text).toLocaleString() }
        }/>
        <Column title="分数" dataIndex="score" key="score" />
      </Table>
    )
  }

  render(){
    let { toPaySubject, examSubject, completedSubject } = this.subjTransfer(this.props.userSubject);
    return(
      <Card>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="未缴费" key="1">
            {this.paymentTabPane(toPaySubject)}
          </TabPane>
          <TabPane tab="待考试" key="2">
            {this.examTabPane(examSubject)}
          </TabPane>
          <TabPane tab="已结束" key="3">
            {this.completedTabPane(completedSubject)}
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default MyEaxmItem;