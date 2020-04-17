import React from 'react';
import { Table, Input, Button, Icon, Card } from 'antd';
import Highlighter from 'react-highlight-words';

let cardStyle = {
  fontSize: '18px', padding: '10px', textAlign: 'left'
}

class PaymentItem extends React.Component {
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
        title: '订单号',
        dataIndex: 'outTradeId',
        key: 'outTradeId',
        ...this.getColumnSearchProps('outTradeId'),
      },
      {
        title: '用户ID',
        dataIndex: 'userID',
        key: 'userID',
        ...this.getColumnSearchProps('userID'),
      },
      {
        title: '科目名称',
        dataIndex: 'subjectName',
        key: 'subjectName',
        ...this.getColumnSearchProps('subjectName'),
      },
      {
        title: '价格',
        dataIndex: 'amount',
        key: 'amount',
        ...this.getColumnSearchProps('amount'),
      },
      {
        title: '是否支付',
        dataIndex: 'completed',
        key: 'completed',
        render: (a) => a ? '是' : '否'
      },
      {
        title: '支付时间',
        dataIndex: 'payTime',
        key: 'payTime',
        render: (a)=> a ? new Date(a).toLocaleString() : ''
      },
    ];
    return (
      <Card bodyStyle={cardStyle}>
        <Table  rowKey={record => record.outTradeId} columns={columns} dataSource={this.props.trades} />
      </Card>
    );
  }
}

export default PaymentItem;