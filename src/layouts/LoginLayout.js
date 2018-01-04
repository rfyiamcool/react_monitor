import React, { Component } from 'react';
import { Form, Row, Input, Button, Checkbox } from 'antd';
import { setToken } from '../utils/request';
import './LoginLayout.less';

import { store } from '../store';
import { push } from 'react-router-redux';

import {
  loginApi
} from '../services/api';

import logo from '../../assets/images/logo.png';

const FormItem = Form.Item;

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      auth: '',
      loading: false,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const resp = await loginApi(values);
        switch (resp.auth) {
          case "success":
            window.localStorage.setItem('token', resp.token);
            setToken(resp.token);
            store.dispatch(push(`/release_manage/process`));
            break;
          case "failed":
            this.setState({ auth: 'failed' });
            break;
          default:
            console.error('wrong auth')
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const authFailedMsg = {};
    if (this.state.auth === 'failed') {
      authFailedMsg.validateStatus = 'error';
      authFailedMsg.help = '用户名或密码错误';
    }
    return (
      <div className="form" onSubmit={this.handleSubmit}>
        <div className="login-logo">
          <img src={logo} alt="logo" />
          <span>DEPLOY MANAGER</span>
        </div>

        <Form>
          <FormItem
            {...authFailedMsg}
            hasFeedback>
            {getFieldDecorator('name', {
              rules: [{
                required: true,
              },],
            })(<Input size="large"
              onChange={() => { this.setState({ auth: '' }) }}
              onPressEnter={this.handleSubmit}
              placeholder="Username"
              autoComplete="off" />)}
          </FormItem>
          <FormItem
            {...authFailedMsg}
            hasFeedback>
            {getFieldDecorator('password', {
              rules: [{
                required: true,
              },],
            })(<Input
              size="large"
              onChange={() => { this.setState({ auth: '' }) }}
              type="password" onPressEnter={this.handleSubmit}
              placeholder="Password"
              autoComplete="off" />)}
          </FormItem>
          <Row>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住我</Checkbox>
              )}
            <a className="login-form-forgot" href="">忘记密码</a>
            <Button type="primary" size="large" htmlType="submit" className="login-form-button" loading={false}>
              登录
            </Button>
            <a href="">注册</a>
          </Row>

        </Form>
      </div>
    )
  }
}

const LoginLayout = Form.create()(Login);

export default LoginLayout;
