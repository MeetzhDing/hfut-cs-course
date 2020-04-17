import React from 'react';
import { Table, Input, Button, Icon, Card } from 'antd';
import Highlighter from 'react-highlight-words';

let cardStyle = {
  fontSize: '18px', padding: '10px', textAlign: 'left'
}

class UserItem extends React.Component {
  state = {
    searchText: '',
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
        title: 'ID',
        dataIndex: 'userID',
        key: 'userID',
        ...this.getColumnSearchProps('userID'),
      },
      {
        title: '用户邮箱',
        dataIndex: 'email',
        key: 'email',
        ...this.getColumnSearchProps('email'),
      },
      {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
        ...this.getColumnSearchProps('username'),
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        ...this.getColumnSearchProps('gender'),
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        ...this.getColumnSearchProps('age'),
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
        ...this.getColumnSearchProps('phone'),
      },
    ];
    return (
      <Card bodyStyle={cardStyle}>
        <Table rowKey={ (record)=> record.userID } columns={columns} dataSource={this.props.userinfo} />
      </Card>
    );
  }
}

export default UserItem;