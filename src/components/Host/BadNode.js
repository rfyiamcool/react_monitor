import React, { Component } from 'react';
import { Card, Table, Input, Select, Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditModal from './EditModal';
import utils from '../../utils/utils';
import moment from 'moment';

import {
  fetchBadNodes,
} from '../../services/api';

const mapStateToProps = state => ({
    ...state.common
  });

const mapDispatchToProps = dispatch => ({
});

class BadNodeList extends Component {
  constructor(props) {
    super(props);

    console.log(18, 18);
    Request = utils.parseQueryParams();
    let domain = Request["domain"];

    this.columns = [
      {
        title: '省份',
        dataIndex: 'province',
        width: '7%',
        key: 'province'
      }, {
        title: 'ISP',
        dataIndex: 'isp',
        width: '7%',
        key: 'isp'
      }, {
        title: 'IP',
        dataIndex: 'ip',
        width: '20%',
        key: 'ip'
      }, {
        title: '丢包',
        dataIndex: 'packet_loss',
        width: '20%',
        key: 'packet_loss'
      }, {
        title: '可用性',
        dataIndex: 'availability',
        width: '20%',
        key: 'availability',
      }, {
        title: '相应时间',
        dataIndex: 'response_time',
        width: '20%',
        key: 'response_time',
      },
    ]
    this.state = {
      domain: domain,
      tableLoading: false,

      hostList: [],
      visible: false,
      title: '坏节点',
    }
  }

  getBadNodeList = async () => {
    this.setState({ tableLoading: true });
    const resp = await fetchBadNodes(this.state.domain);

    this.setState({
      hostList: resp,
      hostCount: 10,
      tableLoading: false,
    })
  }

  componentDidMount = () => {
    this.getBadNodeList();
    this.setState({title: "坏节点" + "  " + "(" + this.state.domain + ")"});
  }

  render() {
    return (
        <Card title={this.state.title} className="card">
            <Table
            className="table"
            loading={this.state.tableLoading}
            columns={this.columns}
            dataSource={this.state.hostList}
            />
        </Card>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BadNodeList);
