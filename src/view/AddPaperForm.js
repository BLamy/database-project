import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

const AddPaperForm = Form.create()(React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.handleSubmit){
          this.props.handleSubmit(values);
        }
      }
    });
  },
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem label="Title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input your title!' }],
          })(
            <Input placeholder="Title" />
          )}
        </FormItem>
        <FormItem label="Abstract">
          {getFieldDecorator('abstract', {
            rules: [{ message: 'Please input your Abstract!' }],
          })(
            <Input placeholder="Abstract" />
          )}
        </FormItem>
        <FormItem label="Citation">
          {getFieldDecorator('citation', {
            rules: [{ message: 'Please input your Abstract!' }],
          })(
            <Input placeholder="Citation" />
          )}
        </FormItem>
      </Form>
    );
  },
}));

AddPaperForm.propTypes = {
  handleSubmit: React.PropTypes.func
};

export default AddPaperForm;
