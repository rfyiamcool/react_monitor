import React, { Component } from 'react';
import { Card, Table, Input, Select, Button, Popconfirm } from 'antd';
import { Row, Col, DatePicker, Radio } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditModal from './EditModal';
import ShowLine from './line';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/grid';
import 'echarts/lib/chart/line';


const { MonthPicker, RangePicker } = DatePicker;

import {
  fetchIpHistory,
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

class IpHistoryCharts extends Component {
  constructor(props) {
    super(props);

    console.log("ip history init");

    Request = this.parseQueryParams();
    let isp = Request["isp"];
    let ip = Request["ip"];
    let province = Request["province"];

    var t=new Date();
    var now = parseInt(t.getTime()/1000);
    let oneDayBefore=now-(60*60*24);

    this.state = {
      search: {
        ip: ip,
        province: province,
        isp: isp,
        startTime: oneDayBefore,
        endTime: now,
        role: "ipHistory"
      },
      visible: false,
      quickTime: '1d'
    }
    console.log(this.state.search);
  }

  // 每次父层调用都会触发, 生命周期在render之前发生.
  componentWillReceiveProps(nextProps) {
  }

  parseQueryParams = () => {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
        theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  }

  componentDidMount = () => {
  }

  render() {
    let mgnB8 = { marginBottom: 10 };
    let colB8 = { marginRight: 10 };

    return (
      <div>
      <Card title="IP质量趋势" className="card">
        <div>
          <Row>
            <Col span={5} >
              <label style={colB8}>省份:</label>
              <Input placeholder="province" value={this.state.search.province} style={{ width: 100 }}/>
            </Col>
            <Col span={5}>
              <label style={colB8}>isp:</label>
              <Input placeholder="填写isp" value={this.state.search.isp} style={{ width: 100 }}/>
            </Col>
            <Col span={5}>
              <label style={colB8}>ip:</label>
              <Input placeholder="填写ip" value={this.state.search.ip} style={{ width: 100 }}/>
            </Col>
            <Col span={5}>
              <label style={colB8}>快捷时间:</label>
              <Select
                  className="last_time"
                  defaultValue={this.state.quickTime}
                  style={{ width: 120, marginRight: 8}}
                  onChange={(value) => {
                      var t=new Date();
                      var now = parseInt(t.getTime()/1000);
                      var startTime = now

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
                      };
                      this.setState({
                          search: {
                            ip: this.state.search.ip,
                            province: this.state.search.province,
                            isp: this.state.search.isp,
                            role: this.state.search.role,
                            startTime: startTime,
                            endTime: now
                          },
                        }
                      );
                    }
                  }
                >
                <Option key="1h" value="1h">最近一小时</Option>
                <Option key="3h" value="3h">最近三小时</Option>
                <Option key="12h" value="12h">最近十二小时</Option>
                <Option key="1d" value="1d">最近一天</Option>
                <Option key="7d" value="7d">最近七天</Option>
              </Select>
            </Col>
          </Row>
        </div>
      </Card>
      <ShowLine searchParams={this.state.search}
      /> 
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IpHistoryCharts);
