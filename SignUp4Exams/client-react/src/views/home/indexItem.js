import React, { Component } from "react";
import { Card } from "antd";
import memoize from "memoize-one";

let gridStyle = {
  width: "25%",
  textAlign: "center"
};

let cardStyle = {
  fontSize: '18px', padding: '10px', paddingLeft: '30px', textAlign: 'left'
}

let numStyle = {
  fontSize: '3em',
  fontWeight: '700'
}

class IndexItem extends Component{
  constructor(props){
    console.log('IndexItem constructor');
    super(props);
  }

  subjCount = memoize(
    (subjects)=>{
      let [count,unpaid,waited,completed] = [0,0,0,0];
      let date = new Date();
      subjects.forEach(cur => {
        count++;
        if(cur.payment===0) unpaid++;
        if(date < new Date(cur.examTime)) waited++;
        if(cur.score) completed++;
      });
      console.log({count,unpaid,waited,completed})
      return({count,unpaid,waited,completed})
    }
  )

  render(){
    let {count, unpaid, waited, completed} = this.subjCount(this.props.userSubject);

    return(
      <div>
        <Card style={{marginBottom: '15px'}} bodyStyle={cardStyle}>{this.props.userInfo.username}, 欢迎使用报名查分系统</Card>
        <Card style={{marginBottom: '15px'}} headStyle={cardStyle} title={"概览"}>
          <Card.Grid style={gridStyle}>
            <p>所有考试</p>
            <p style={numStyle}>{count}</p>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <p>待缴费考试</p>
            <p style={numStyle}>{unpaid}</p>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <p>等待考试</p>
            <p style={numStyle}>{waited}</p>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <p>已结束考试</p>
            <p style={numStyle}>{completed}</p>
          </Card.Grid>
        </Card>
      </div>
    )
  }
}

export default IndexItem;