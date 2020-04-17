import React from 'react';
import { Table, Input, Button, Icon, Card, InputNumber, Select } from 'antd';
import { connect } from 'react-redux';
import Highlighter from 'react-highlight-words';
import {
  querySubjUserRequest,
  setScoreRequest
} from '../../../redux/actions';

let cardStyle = {
  fontSize: '18px', padding: '10px', textAlign: 'left'
}

const mapStateToProps = state => {
  return {
    data: state.data,
    pageState: state.ui.regScore
  }
}

const mapDispatchToProps = dispatch => {
  return {
    querySubjUser: payload => {
      dispatch( querySubjUserRequest(payload) )
    },
    setScore: payload => {
      dispatch( setScoreRequest(payload) )
    }
  }
}


class RegScore extends React.Component {

  state = {
    subjectName: '',
    searchText: '',
    score: 0
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  render(){
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'userID',
        key: 'userID',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.userID - b.userID,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ...this.getColumnSearchProps('username'),
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender'
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        sorter: (a, b) => a.age - b.age
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
        sorter: (a, b) => a.phone - b.phone
      },
      {
        title: '分数',
        dataIndex: 'score',
        key: 'score',
      },
      {
        title: '设定分数',
        key: 'action',
        render: (text, record)=>{
          return (
            <span>
              <InputNumber min={0} max={100} onChange={(value)=>this.setState({score: value})}></InputNumber>
              <Button onClick={()=>{
                this.props.setScore({
                  subjectID: this.state.subjectID,
                  userID: record.userID,
                  score: this.state.score
                })
              }}>提交</Button>
            </span>
          )
        }
      }
    ];

    const Option = Select.Option;
    let listItems = <Option></Option>;
    if(this.props.data.subjects){
      listItems = this.props.data.subjects.map((subj) =>
        <Option key={subj.subjectID} value={ subj.subjectID }>
          {subj.subjectName}
        </Option>
      )
    }
    return(
      <Card style={cardStyle} >
        <div style={{marginBottom: "20px"}}>
          <span> 科目分数登记 </span>
          <Select placeholder="请选择" style={{width: "100px"}}
            onChange={ (value)=>{
              this.setState({subjectID: value});
              this.props.querySubjUser(value);
            } }
          >
            {listItems}
          </Select>
        </div>
        <Table rowKey={ (record)=>record.userID } columns={columns} dataSource={this.props.pageState.subjUserInfo} />
      </Card>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegScore);