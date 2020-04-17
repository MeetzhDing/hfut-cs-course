import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd';

const WrappedRegisterForm = Form.create({ name: 'register_modal' })(
  class extends Component {

    state = {
      confirmDirty: false
    };

    handleSubmit = e => {
      e.preventDefault();
      let errFlag = true;
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          errFlag = false;
        }
      });
      if(!errFlag){
        this.props.onCreate();
      }
    };

    handleConfirmBlur = e => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };

    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };

    render() {
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };

      const { visible, onCancel, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="用户注册"
          okText="Create"
          onCancel={onCancel}
          onOk={this.handleSubmit}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: '用户邮箱不合法!',
                  },
                  {
                    required: true,
                    message: '请输入用户邮箱!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="密码" hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户密码!',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password />)}
            </Form.Item>
            <Form.Item label="确认密码" hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '两次密码不一致!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password onBlur={this.handleConfirmBlur} />)}
            </Form.Item>
            <Form.Item label="姓名" >
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户姓名!', whitespace: true }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default WrappedRegisterForm;