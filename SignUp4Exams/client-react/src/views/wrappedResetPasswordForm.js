import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd';

const WrappedResetPasswordForm = Form.create({ name: 'resetPassword_modal' })(
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
          title="找回密码"
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
          </Form>
        </Modal>
      );
    }
  },
);

export default WrappedResetPasswordForm;