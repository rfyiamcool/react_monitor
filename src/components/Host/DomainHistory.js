import React, { Component } from 'react';
import { Card, Table, Input, Select, Button, Popconfirm } from 'antd';
import { Row, Col, DatePicker, Radio } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditModal from './EditModal';
import ShowLine from './line';
import utils from '../../utils/utils';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/grid';
import 'echarts/lib/chart/line';


const { MonthPicker, RangePicker } = DatePicker;

import {
  fetchIpHistory,
  fetchDomainList,
} from '../../services/api';
import { request } from '../../utils/request';
import { noop } from 'zrender/lib/core/util';

const { Search } = Input;
const Option = Select.Option;

const mapStateToProps = state => ({
  ...state.common
});

const mapDispatchToProps = dispatch => ({
});

class DomainHistory extends Component {
  constructor(props) {
    super(props);

    var t=new Date();
    var now = parseInt(t.getTime()/1000);
    let oneDayBefore=now-(60*60*24);

    this.state = {
      domainList: [],
      packetLossData: [],
      packetLossTs: [],
      responseTimeData: [],
      responseTimeTs: [],
      vailabilityData: [],
      vailabilityTs: [],

      title: '域名趋势',
      province: '北京',
      isp: '联通',
      startTime: oneDayBefore,
      endTime: now,
      quickTime: '1d',
      search: {}
    }
  }

  onChangeDomain = (e) => {
    this.setState({domain: e});
  }

  getDomainList = async () => {
    const resp = await fetchDomainList();
    this.setState({
      domainList: resp.domain_list
    });
  }

  showLineGraph = () => {
    this.setState({
      search: {
        domain: this.state.domain,
        province: this.state.province,
        isp: this.state.isp,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        role: "domainHistory"
      }
    });
    console.log("req 85,85", this.state.domain, this.state.isp, this.state.province);
  }

  componentDidMount = () => {
    this.getDomainList();
    // Request = utils.parseQueryParams();
    // var isp = Request["isp"];
    // var ip = Request["ip"];
    // var province = Request["province"];
    // this.setState({
    //   "ip":ip,
    //   "isp": isp,
    //   "province": province,
    // })
  }

  render() {
    let colB8 = { marginRight: 8 };
    console.log("req 118", this.state.province, this.state.isp);

    return (
      <div>
      <Card title={this.state.title} className="card">
        <div>
          <Row>
            <Col span={6} >
              <label style={colB8}>域名:</label>
              <Select
                className="search"
                defaultValue=''
                onChange={(value) => {
                  this.setState({ domain: value });
                }}
              >
                {this.state.domainList.map((item) => {
                  return (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  )
                })}
              </Select>
            </Col>
            <Col span={4} >
              <label style={colB8}>省份:</label>
              <Select
                className="province"
                defaultValue="北京"
                style={{ width: 80 }}
                onChange={(value) => {
                  this.setState({ province: value });
                  console.log("change provice", value);
                }}
              >
                  <Option value="上海">上海</Option>
                  <Option value="云南">云南</Option>
                  <Option value="北京">北京</Option>
                  <Option value="吉林">吉林</Option> 
                  <Option value="四川">四川</Option>
                  <Option value="天津">天津</Option>
                  <Option value="宁夏">宁夏</Option>
                  <Option value="安徽">安徽</Option>
                  <Option value="山东">山东</Option>
                  <Option value="山西">山西</Option>
                  <Option value="陕西">陕西</Option>
                  <Option value="广东">广东</Option>
                  <Option value="广西">广西</Option>
                  <Option value="新疆">新疆</Option>
                  <Option value="江苏">江苏</Option>
                  <Option value="江西">江西</Option>
                  <Option value="河北">河北</Option>
                  <Option value="河南">河南</Option>
                  <Option value="浙江">浙江</Option>
                  <Option value="海南">海南</Option>
                  <Option value="湖北">湖北</Option>
                  <Option value="湖南">湖南</Option>
                  <Option value="甘肃">甘肃</Option>
                  <Option value="福建">福建</Option>
                  <Option value="西藏">西藏</Option>
                  <Option value="贵州">贵州</Option>
                  <Option value="辽宁">辽宁</Option>
                  <Option value="重庆">重庆</Option>
                  <Option value="青海">青海</Option>
                  <Option value="内蒙古">内蒙古</Option>
                  <Option value="黑龙江">黑龙江</Option>
              </Select>
            </Col>
            <Col span={4}>
              <label style={colB8}>isp:</label>
              <Select
                className="isp"
                defaultValue="联通"
                style={{ width: 75}}
                onChange={(value) => {
                  this.setState({ isp: value });
                  console.log("change isp", value);
                }}
              >
                <Option key="联通" value="联通">联通</Option>
                <Option key="电信" value="电信">电信</Option>
                <Option key="移动" value="移动">移动</Option>
              </Select>
            </Col>
            <Col span={6}>
              <label style={colB8}>快捷时间:</label>
              <Select
                  className="last_time"
                  defaultValue='1d'
                  style={{ width: 115}}
                  onChange={(value) => {
                      var t=new Date();
                      var now = parseInt(t.getTime()/1000);
                      var startTime = now

                      console.log(215, 215, value);

                      switch (value){
                      case "1h":
                          startTime=now-(60*60*1);
                          break;
                      case "3h":
                          startTime=now-(60*60*3);
                          break;
                      case "12h":
                          startTime=now-(60*60*12);
                          break;
                      case "1d":
                          startTime=now-(60*60*24);
                          break;
                      case "7d":
                          startTime=now-(60*60*24*7);
                          break;
                      case "15d":
                          startTime=now-(60*60*24*15);
                          break;
                      }
                      this.setState({startTime: startTime, endTime: now});
                  }}
                >
                <Option key="1h" value="1h">最近一小时</Option>
                <Option key="3h" value="3h">最近三小时</Option>
                <Option key="12h" value="12h">最近十二小时</Option>
                <Option key="1d" value="1d">最近一天</Option>
                <Option key="7d" value="7d">最近七天</Option>
                <Option key="15d" value="15d">最近十五天</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Button type="primary" loading={this.state.loading} onClick={this.showLineGraph}>
              查询
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
      <ShowLine searchParams={this.state.search} /> 
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DomainHistory);
