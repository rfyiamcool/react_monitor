// 从 top 里引入该组件.

import React, { Component } from 'react';
import { Card, Table, Input, Select, Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditModal from './EditModal';
import utils from '../../utils/utils';
import moment from 'moment';

import {
  GET_HOST_SELECT_DATA,
  GET_HOST_GORUP_HOST_RELATION_SELECT_DATA,
} from '../../actionTypes';

import {
  getHostSelectDataApi,
  getHostListApi,
  deleteHostApi,
  getDomainProvinceIPList,
  fetchInfoByDomain,
} from '../../services/api';

const { Search } = Input;
const Option = Select.Option;

const mapStateToProps = state => ({
  ...state.common
});

const mapDispatchToProps = dispatch => ({
  getHostSelectData: (data) => dispatch({ type: GET_HOST_SELECT_DATA, data }),
  getHostGroupHostRelationSelectData: (data) => dispatch({ type: GET_HOST_GORUP_HOST_RELATION_SELECT_DATA, data }),
});

class HostList extends Component {
  constructor(props) {
    super(props);

    Request = utils.parseQueryParams();
    let isp = Request["isp"];
    let domain = Request["domain"];
    let province = Request["province"];

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
        width: '15%',
        key: 'ip'
      }, {
        title: '厂商',
        dataIndex: 'vendor',
        width: '10%',
        key: 'vendor'
      }, {
        title: '更新时间',
        dataIndex: 'updated_at',
        width: '20%',
        render: (text, data) => {
          return (
            moment(text).format("YYYY/MM/DD HH:mm")
          );
        }
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        width: '20%',
        render: (text, data) => {
          return (
            moment(text).format("YYYY/MM/DD HH:mm")
          );
        }
      }, {
        title: '图表',
        width: '10%',
        render: (text, data) => {
          let url = "/show/history/ip?isp=" + data.isp + "&ip=" + data.ip + "&province=" + data.province;
          return (
            <Link to={url}>查看</Link>
          );
        }
      }
    ]
    this.state = {
      domain: domain,
      isp: isp,
      province: province,
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      hostCount: 0,

      hostList: [],
      visible: false,
      title: '详细数据',
      currentId: 0,

      searchword: '',
      group_id: 0,
    }
  }

  getHostList = async (start = 0, length = this.state.pageSize, searchword = null, group_id = null) => {
    if (searchword === null) {
      searchword = this.state.searchword;
    }
    if (group_id === null) {
      group_id = this.state.group_id;
    }
    this.setState({ tableLoading: true });
    // const resp = await getDomainProvinceIPList("x.com", "广东", "移动");
    const resp = await fetchInfoByDomain(this.state.domain, this.state.province, this.state.isp);

    this.setState({
      hostList: resp.data,
      hostCount: 10,
      tableLoading: false,
    })
  }

  componentDidMount = () => {
    this.getHostList();
    this.setState({title: "详细数据" + "  " + "(" + this.state.domain + ")"});
  }

  onTableChange = async (pagination, filters, sorter) => {
    const page = pagination.current;
    this.setState({
      pageNum: page
    });
    const start = (page - 1) * this.state.pageSize;
    const length = this.state.pageSize;
    await this.getHostList(start, length);
  }

  render() {
    return (
      <Card title={this.state.title} className="card">
        <Table
          className="table"
          loading={this.state.tableLoading}
          rowKey={record => record.id}
          columns={this.columns}
          dataSource={this.state.hostList}
          onChange={this.onTableChange}
          pagination={{
            current: this.state.pageNum,
            pageSize: this.state.pageSize,
            total: this.state.hostCount
          }}
        />
        <EditModal
          visible={this.state.visible}
          currentId={this.state.currentId}
          title={this.state.title}
          onCancel={() => this.setState({ visible: false })}
          resetCurrentId={() => this.setState({ currentId: 0 })}
          hostGroupSelectData={this.props.hostGroupSelectData}
          getHostList={this.getHostList}
        />
      </Card>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HostList);
