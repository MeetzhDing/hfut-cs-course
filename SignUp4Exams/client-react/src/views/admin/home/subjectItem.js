import React from 'react';
import { Table, Input, Button, Icon, Card, Modal, Form, DatePicker, InputNumber, } from 'antd';
import { connect } from 'react-redux';
import Highlighter from 'react-highlight-words';
import {
  addSubjectRequest,
  deleteSubjRequest,

} from '../../../redux/actions';

let cardStyle = {
  fontSize: '18px', padding: '10px', textAlign: 'left'
}

const mapStateToProps = state => {
  return {
    data: state.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addSubject: payload => {
      dispatch( addSubjectRequest(payload) )
    },
    deleteSubj: payload => {
      dispatch( deleteSubjRequest(payload) )
    }
  }
}


const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="科目名称">
              {getFieldDecorator('subjectName', {
                rules: [{ required: true, message: '请输入科目名称!' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="报名费用">
              {getFieldDecorator('subjectCost', {
                rules: [{ required: true, message: '请输入报名费用！' }]
              })(<InputNumber min={0} step={0.01} />)}
            </Form.Item>
            <Form.Item label="报名截止时间">
              {getFieldDecorator('registerDeadline', {
                rules: [{ type: 'object', required: true, message: '请输入报名截止时间' }],
              })(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
              )}
            </Form.Item>
            <Form.Item label="考试时间">
              {getFieldDecorator('examTime', {
                rules: [{ type: 'object', required: true, message: '请输入考试时间' }],
              })(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);


class SubjectItem extends React.Component {
  state = {
    searchText: '',
    modalVisible: false
  };


  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
    });
    let values = form.getFieldsValue()
    let registerDeadline = values.registerDeadline.format("YYYY-MM-DD HH:mm:ss");
    let examTime = values.examTime.format("YYYY-MM-DD HH:mm:ss");
    this.props.addSubject({ ...values, registerDeadline, examTime });
    form.resetFields();
    this.setState({ modalVisible: false });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
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

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: '科目ID',
        dataIndex: 'subjectID',
        key: 'subjectID',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.subjectID - b.subjectID,
      },
      {
        title: '科目名称',
        dataIndex: 'subjectName',
        key: 'subjectName',
        ...this.getColumnSearchProps('subjectName'),
      },
      {
        title: '报名费用',
        dataIndex: 'subjectCost',
        key: 'subjectCost',
        sorter: (a, b) => a.subjectCost - b.subjectCost
      },
      {
        title: '报名截止日期',
        dataIndex: 'registerDeadline',
        key: 'registerDeadline',
        sorter: (a, b) => a.registerDeadline - b.registerDeadline,
        render: (a)=> new Date(a).toLocaleString()
      },
      {
        title: '考试时间',
        dataIndex: 'examTime',
        key: 'examTime',
        sorter: (a, b) => a.examTime - b.examTime,
        render: (a)=> new Date(a).toLocaleString()
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record)=>{
          return (
            <Button onClick={()=>{
                        console.log(record)
              this.props.deleteSubj(record.subjectName)
            }}>删除科目</Button>
          )
        }
      }
    ];
    return (
      <Card bodyStyle={cardStyle}>
        <Button style={{ margin: "10px 0px" }} onClick={()=>{ this.setState( {modalVisible: true} )}}>添加科目</Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalVisible}
          onCancel={ ()=>{this.setState( {modalVisible: false} )} }
          onCreate={this.handleCreate}
        />
        <Table rowKey={ (record)=>record.subjectID } columns={columns} dataSource={this.props.data.subjects} />
      </Card>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubjectItem);