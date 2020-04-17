import React, { Component } from "react";
import { Card } from "antd";

let cardStyle = {
  fontSize: '18px', padding: '10px', paddingLeft: '30px', textAlign: 'left'
}

class IndexItem extends Component{
  render(){
    return(
      <div>
        <Card bodyStyle={cardStyle}>{this.props.session.username}, 欢迎使用报名查分系统</Card>
      </div>
    )
  }
}


export default IndexItem;