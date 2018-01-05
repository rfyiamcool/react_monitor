import React, { Component } from 'react';
import { Modal, Form, Button, Input, Select } from 'antd';

import {
  AddIp,
  editHostListApi,
  getHostDetailApi
} from '../../services/api';

const FormItem = Form.Item;
const Option = Select.Option;

class EditModalBase extends Component {
  constructor(props) {
    super(props);
    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    this.state = {
      submiting: false,
      nameRepeat: false,
      province: '北京',
      isp:'联通',
      ip:'',
    }
  }
  componentWillReceiveProps = async (nextProps) => {
    if (nextProps.currentId !== this.props.currentId) {
      console.log(nextProps.currentId, nextProps.currentId === 0)
      if (nextProps.currentId === 0) {
        this.props.form.resetFields();
      } else {
        const resp = await getHostDetailApi(nextProps.currentId);
        const host_group = [];
        resp.host_group_id_list.map((host_group_id) => host_group.push(host_group_id.toString()));
        this.props.form.setFieldsValue({
          name: resp.name,
          host_group: host_group,
        })
      }
    }
  }
  onSubmit = () => {
    this.props.form.validateFields(async (error, value) => {
      if (!error) {

        this.setState({ submiting: true });

        console.log(this.state);
        const resp =  await AddIp({
          province: this.state.province,
          isp: this.state.isp,
          ip: this.state.ip
        });

        this.setState({ submiting: false });
        console.log("resp: ", resp);
        if (resp.ip) {
            this.props.resetCurrentId();
            this.props.form.resetFields();
            this.props.onCancel();
            this.props.getIPList();
        }
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let extraNameMsg = {};
    return (
      <Modal
        visible={this.props.visible}
        title={this.props.title}
        onCancel={this.props.onCancel}
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
            label="IP地址"
            hasFeedback
            {...extraNameMsg}
          >
            {getFieldDecorator('ip', {
              rules: [
                {
                  type: 'string', max: 13, message: 'ip error',
                },
                {
                  required: true, message: 'ip error',
                },
                { pattern: ""}
              ],
            })(
              <Input
                onChange={(e) => {
                  this.setState({ ip: e.target.value });
                }}
                onPressEnter={this.onSubmit}
                autoComplete="off" />
              )}
          </FormItem>
          <FormItem
            label="ISP"
            {...this.formItemLayout}
            hasFeedback>
            {getFieldDecorator('isp')(
                <Select
                    className="multiple"
                    style={{ width: 100, marginRight: 16 }}
                    onChange={(e) => {
                      this.setState({ isp: e});
                    }}
                  >
                      <Option key="联通" value="联通">联通</Option>
                      <Option key="电信" value="电信">电信</Option>
                      <Option key="移动" value="移动">移动</Option>
                  </Select>
            )}
          </FormItem>
          <FormItem
            label="省份"
            {...this.formItemLayout}
            hasFeedback>
            {getFieldDecorator('province')(
                <Select
                    className="multiple"
                    style={{ width: 100, marginRight: 16 }}
                    onChange={(value) => {
                      this.setState({ province: value });
                    }}
                  >
                      <Option key="上海" value="上海">上海</Option>
                      <Option key="云南" value="云南">云南</Option>
                      <Option key="北京" value="北京">北京</Option>
                      <Option key="吉林" value="吉林">吉林</Option> 
                      <Option key="四川" value="四川">四川</Option>
                      <Option key="天津" value="天津">天津</Option>
                      <Option key="宁夏" value="宁夏">宁夏</Option>
                      <Option key="安徽" value="安徽">安徽</Option>
                      <Option key="山东" value="山东">山东</Option>
                      <Option key="山西" value="山西">山西</Option>
                      <Option key="陕西" value="陕西">陕西</Option>
                      <Option key="广东" value="广东">广东</Option>
                      <Option key="广西" value="广西">广西</Option>
                      <Option key="新疆" value="新疆">新疆</Option>
                      <Option key="江苏" value="江苏">江苏</Option>
                      <Option key="江西" value="江西">江西</Option>
                      <Option key="河北" value="河北">河北</Option>
                      <Option key="河南" value="河南">河南</Option>
                      <Option key="浙江" value="浙江">浙江</Option>
                      <Option key="海南" value="海南">海南</Option>
                      <Option key="湖北" value="湖北">湖北</Option>
                      <Option key="湖南" value="湖南">湖南</Option>
                      <Option key="甘肃" value="甘肃">甘肃</Option>
                      <Option key="福建" value="福建">福建</Option>
                      <Option key="西藏" value="西藏">西藏</Option>
                      <Option key="贵州" value="贵州">贵州</Option>
                      <Option key="辽宁" value="辽宁">辽宁</Option>
                      <Option key="重庆" value="重庆">重庆</Option>
                      <Option key="青海" value="青海">青海</Option>
                      <Option key="内蒙古" value="内蒙古">内蒙古</Option>
                      <Option key="黑龙江" value="黑龙江">黑龙江</Option>
                  </Select>
            )}

          </FormItem>
        </Form>
      </Modal>
    )
  }
}

const EditModal = Form.create()(EditModalBase);

export default EditModal;
