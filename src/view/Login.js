import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

const Login = Form.create()(React.createClass({
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
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  },
}));





//
// ({ handleSubmit }) => (
//   <LoginWrapper>
//     <Form onSubmit={handleSubmit}>
//       <TextField fullWidth floatingLabelText="username" />
//       <TextField fullWidth type="password" floatingLabelText="password" />
//       <BottomRight>
//         <FlatButton primary type="submit">Sign In</FlatButton>
//       </BottomRight>
//     </Form>
//   </LoginWrapper>
// );
Login.propTypes = {
  handleSubmit: React.PropTypes.func
};

export default Login;
