import React from 'react';
import styled from 'styled-components';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

const LoginWrapper = styled(Paper)`
  width: 80%;
  max-width: 500px;
  position: absolute;
  top: 33%;
  z-index: 9001;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Model = styled.div`
  background-color: rgba(0, 0, 0, .3);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9000;
  top: 0;
`;

const Form = styled.form`
  padding: 20px;
`;

const BottomRight = styled.div`
  margin: 10px;
  float: right;
`;

const Login = ({ handleSubmit, store }) => (
  <Model>
    <LoginWrapper>
      <AppBar title="Login" showMenuIconButton={false} />
      <Form onSubmit={handleSubmit}>
        <TextField fullWidth floatingLabelText="username" />
        <TextField fullWidth type="password" floatingLabelText="password" />
        <BottomRight>
          <FlatButton primary type="submit">Sign In</FlatButton>
        </BottomRight>
        <FlatButton onTouchTap={() => store.dispatch({ type: "client/LOGIN_SUCCESS", user: { username: "Faculity", group: "Faculity" } })}>TempFaculity</FlatButton>
        <FlatButton onTouchTap={() => store.dispatch({ type: "client/LOGIN_SUCCESS", user: { username: "Student", group: "Student" } })}>TempStudent</FlatButton>
      </Form>
    </LoginWrapper>
  </Model>
);
Login.propTypes = {
  handleSubmit: React.PropTypes.func
};

export default Login;
