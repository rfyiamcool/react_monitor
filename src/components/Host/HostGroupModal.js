import React, { Component } from 'react';
import { Modal, Form, Button, Input, Transfer } from 'antd';

import {
  editHostGroupApi,
  getHostGroupDetailApi
} from '../../services/api';

const FormItem = Form.Item;

class HostGroupModalBase extends Component {
  constructor(props) {
    super(props);
    this.formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    this.state = {
      hostData: [],
      targetKeys: [],
      submiting: false,
      nameRepeat: false,
    }
  }
  updateHost = () => {
    let hostData = [];
    let targetKeys = this.state.targetKeys;
    for (const host of this.props.hostSelectData) {
      hostData.push({
        key: host.id,
        title: host.name,
      })
    }
    this.setState({ hostData, targetKeys });
  }

  componentDidMount = () => {
    this.updateHost();
  }
  componentWillReceiveProps = async (nextProps) => {
    if (nextProps.timestamp !== this.props.timestamp) {
      this.updateHost();
    }
    if (nextProps.currentId !== this.props.currentId) {
      if (nextProps.currentId === 0) {
        this.props.form.resetFields();
        this.setState({ targetKeys: [] });
      } else {
        const resp = await getHostGroupDetailApi(nextProps.currentId);
        this.props.form.setFieldsValue({
          name: resp.name,
        })
        this.setState({targetKeys: resp.host_id_list});
      }
    }
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  }
  onSubmit = () => {
    this.props.form.validateFields(async (error, value) => {
      console.log(error, value)
      if (!error) {
        this.setState({ submiting: true });
        const data = { ...value, id: this.props.currentId }
        const resp = await editHostGroupApi(data);
        this.setState({ submiting: false });
        if (!resp.error) {
          if (resp.message == 'name repeat') {
            this.setState({ nameRepeat: true });
          } else {
            this.props.resetCurrentId();
            this.props.form.resetFields();
            this.props.onCancel();
            this.props.getHostGroupList();
          }
        }
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let extraNameMsg = {};
    if (this.state.nameRepeat) {
      extraNameMsg.validateStatus = 'error';
      extraNameMsg.help = '已存在此名称';
    }
    return (
      <Modal
        visible={this.props.visible}
        title={this.props.title}
        onCancel={this.props.onCancel}
        width="800px"
        footer={[
          <Button key="cancel" size="large" onClick={this.props.onCancel}>取消</Button>,
          <Button key="submit" type="primary" size="large"
            loading={this.state.submiting}
            onClick={this.onSubmit}>
            {this.props.title === '新建' ? '新建' : '修改'}
          </Button>,
        ]}
      >
        <Form layout="horizontal">
          <FormItem
            {...this.formItemLayout}
            label="主机组名称"
            hasFeedback
            {...extraNameMsg}
          >
            {getFieldDecorator('name', {
              rules: [{
                type: 'string', max: 200, message: '主机组名称控制在200个字符以内',
              }, {
                required: true, message: '请输入主机组名称',
              }],
            })(
              <Input
                style={{ width: 545 }}
                onChange={() => this.setState({ nameRepeat: false })}
                onPressEnter={this.onSubmit}
                autoComplete="off" />
              )}
          </FormItem>
          <FormItem
            label="选择主机:"
            {...this.formItemLayout}
          >
            {getFieldDecorator('hosts')(
              <Transfer
                dataSource={this.state.hostData}
                showSearch
                onChange={this.handleChange}
                targetKeys={this.state.targetKeys}
                render={item => item.title}
                listStyle={{
                  width: 250,
                  height: 300,
                }}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

const HostGroupModal = Form.create()(HostGroupModalBase);

export default HostGroupModal;
