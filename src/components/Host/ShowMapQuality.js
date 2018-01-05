import React, { Component } from 'react';
import { Card, Table, Input, Select, Button, Popconfirm, message } from 'antd';
import { Row, Col, DatePicker, Radio} from 'antd';
import { Tag } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditModal from './EditModal';
import ShowMap from './map';
import ShowTop from './top';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/grid';
import 'echarts/lib/chart/line';


const { MonthPicker, RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


import {
  GET_HOST_SELECT_DATA,
  GET_HOST_GORUP_HOST_RELATION_SELECT_DATA,
} from '../../actionTypes';

import {
  fetchHistoryIp,
  fetchDomainList,
  fetchDomainStats,
} from '../../services/api';
import { request } from '../../utils/request';

const { Search } = Input;
const Option = Select.Option;

const mapStateToProps = state => ({
  ...state.common
});

const mapDispatchToProps = dispatch => ({
});

class ShowMapQuality extends Component {
  constructor(props) {
    super(props);

    var t=new Date();
    var now = parseInt(t.getTime()/1000);
    let oneHourBefore=now-(60*60*1);
    
    this.state = {
      avgAvailability: 0,
      nodeCount: 0,
      badCount: 0,
      defaultDomain: '',
      domainList: [],
      title: '',

      domain: '',
      isp: '联通',
      quota:'availability',
      children: [],
      search: {}
    }
  }

  getDomainList = async () => {
    const resp = await fetchDomainList();

    this.setState({
      domainList: resp.domain_list
    });
    return resp;
  }

  componentDidMount = () => {
    this.getDomainList().then((res) => {
      let chs = [];
      for (var domain of res.domain_list) {
        chs.push(<Option key={domain} value={domain}>{domain}</Option>);
      }
      this.setState({children: chs})
      this.setState({defaultDomain: res.domain_list[0]})
    });
    
    console.log(108, 108, this.state.children);
  }

  showMapGraph = () => {
    this.setState({
      search: {
        domain: this.domain,
        quota: this.quota,
        isp: this.isp
      }
    });

    console.log("req", this.domain, this.quota, this.isp);
  }

  domain = '';
  onChangeDomain = (e) => {
    this.domain = e;
  }

  quota = 'availability';
  onChangeQuota = (e) => {
    this.quota = e.target.value;
  }

  isp = '联通';
  onChangeIsp = (e) => {
    this.isp = e.target.value;
  }

  onClickBadNodes = (e) => {
    // console.log("echo bad nodes", e.target.innerText);
    window.open("/show/bad_nodes?domain="+this.domain)
    console.log(this.state.badCount);
  }

  queryDomainStats = async() => {
    const data =  await fetchDomainStats(this.domain);
    // if (!data.code) {
    //   message.error(data);
    // }
    console.log(117, 117, 117, data);
    if (data.bad_count >= 0){
      this.setState({
        avgAvailability: data.average_availability,
        nodeCount: data.node_count,
        badCount: data.bad_count,
      })
    }else{
      this.setState({
        avgAvailability: 0,
        nodeCount: 0,
        badCount: 0,
      })
    }
  }
  
  isInterval = false;
  onClickQuery = () => {
    this.IntervalUpdate()
    console.log("enter onClickQuery");
    if (this.isInterval ===  true){
      return;
    }
    this.isInterval = true;
    window.setInterval(this.IntervalUpdate, 1000 * 15);
  }
  
  IntervalUpdate = () => {
    console.log("enter interval 151");
    this.showMapGraph()
    this.queryDomainStats()
  }

  render() {
    let mgnB8 = {};
    return (
      <div>
        <Card title="Query" className="card" type="inner">
          <Row style={mgnB8}>
            <Col span={7}>
              <labal style={{ marginRight: 8 }}>加速域名:</labal>
              <Select
                showSearch
                className="search"
                defaultValue={this.state.defaultDomain}
                onChange={this.onChangeDomain}
              >
                {this.state.children}
              </Select>
            </Col>
            <Col span={8}>
            <labal style={{ marginRight: 8}}>指标:</labal>
              <RadioGroup onChange={this.onChangeQuota} defaultValue='availability' size="middle">
                <RadioButton value="availability">可用性</RadioButton>
                <RadioButton value="response_time">响应时间</RadioButton>
                <RadioButton value="packet_loss">丢包率</RadioButton>
              </RadioGroup>
            </Col>
            <Col span={6}>
              <labal style={{ marginRight: 8}}>运营商:</labal>
              <RadioGroup onChange={this.onChangeIsp} defaultValue='联通' size="middle">
                <RadioButton value="联通">联通</RadioButton>
                <RadioButton value="电信">电信</RadioButton>
                <RadioButton value="移动">移动</RadioButton>
              </RadioGroup>
            </Col>
            <Col span={3}>
              <Button type="primary" loading={this.state.loading} onClick={this.onClickQuery}>
              查询
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
            </Col>
          </Row>
        </Card>
        <Card>
              <labal style={{ marginRight: 15}}>全国平均可用率:</labal>
              <Tag style={{ marginRight: 40}} color="blue">{this.state.avgAvailability}</Tag>

              <labal style={{ marginRight: 15}}>服务节点总数:</labal>
              <Tag style={{ marginRight: 40}} color="blue">{this.state.nodeCount}</Tag>

              <labal style={{ marginRight: 15}}>不可用节点:</labal>
              <Tag style={{ marginRight: 40}} color="blue" onClick={this.onClickBadNodes}>{this.state.badCount}</Tag>
        </Card>
        <ShowMap searchParams={this.state.search} /> 
        <ShowTop searchParams={this.state.search} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowMapQuality);
