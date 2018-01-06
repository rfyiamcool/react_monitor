import React, { Component } from 'react';
import { Card, Table, Input, Select, Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditModal from './EditModal';

import {
  GET_HOST_SELECT_DATA,
  GET_HOST_GORUP_HOST_RELATION_SELECT_DATA,
} from '../../actionTypes';

import './style.less';

import {
  getHostSelectDataApi,
  getHostListApi,
  deleteHostApi,
  fetchIPList,
  DeleteIpById,
  getDomainProvinceIPList,
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

class IPList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '省份',
        dataIndex: 'province',
        width: '20%',
        key: 'province'
      }, {
        title: 'ISP',
        dataIndex: 'isp',
        width: '20%',
        key: 'isp',
      }, {
        title: 'IP',
        dataIndex: 'ip',
        width: '20%',
        key: 'ip'
      }, {
        title: '创建时间',
        dataIndex: 'updated_at',
        width: '30%',
        key: 'updated_at'
      }, {
        title: '操作',
        width: '20%',
        render: (record, data) => {
          return (
            <span>
              <span className="ant-divider" />
              <Popconfirm
                title={"确认删除" + record.name + '?'}
                onConfirm={async () => {
                  await DeleteIpById(record.id);
                  this.getIPList(
                    this.state.start,
                    this.state.pageSize,
                    this.state.province,
                    this.state.isp,
                    this.state.searchword,
                  );
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }
      }
    ]

    this.state = {
      tableLoading: false,
      pageNum: 1,
      pageSize: 15,
      hostCount: 0,

      hostList: [],
      visible: false,
      title: 'IP资源',
      currentId: 0,
      start: 0,

      isp: 'all',
      province: 'all',
      searchword: ''
    }
    
  }

  onDeleteIp = (e) => {
    console.log("delete ip", e);
    // const resp = await DeleteIpById(e.id);
  }

  getIPList = async (start = 0, length = this.state.pageSize, province=null, isp=null, searchword = null) => {
    if (searchword === null) {
      searchword = this.state.searchword;
    }

    if (province === null) {
      province = this.state.province;
    }

    if (isp === null) {
      isp = this.state.isp;
    }
    this.setState({ tableLoading: true });
    const resp = await fetchIPList(start, length, province, isp, searchword);

    this.setState({
      hostList: resp.ip_list,
      hostCount: resp.total_count,
      tableLoading: false,
    })
  }

  componentDidMount = () => {
    this.getIPList(
      this.state.start,
      this.state.pageSize,
      this.state.province,
      this.state.isp,
      this.state.searchword,
    );
  }

  onTableChange = async (pagination, filters, sorter) => {
    const page = pagination.current;
    this.setState({
      pageNum: page
    });
    const start = (page - 1) * this.state.pageSize;
    const length = this.state.pageSize;
    await this.getIPList(start, length);
  }

  onClickSearch = () =>{
    this.getIPList(
      this.state.start,
      this.state.pageSize,
      this.state.province,
      this.state.isp,
      this.state.searchword,
    );
  }

  render() {
    let mgnB8 = { marginRight: 8 };
    
    return (
      <Card title="IP资源" className="card">
        <div>
          <label style={mgnB8}>省份:</label>
          <Select
            className="province"
            defaultValue={this.state.province}
            style={{ width: 100, marginRight: 16 }}
            onChange={(value) => {
              this.setState({ province: value });
            }}
          >
              <Option key="all" value="all">all</Option>
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
          <label style={mgnB8}>运营商:</label>
          <Select
            className="isp"
            defaultValue={this.state.isp}
            style={{ width: 100, marginRight: 16}}
            onChange={(value) => {
              this.setState({ isp: value });
            }}
          >
                <Option key="all" value="all">all</Option>
                <Option key="联通" value="联通">联通</Option>
                <Option key="电信" value="电信">电信</Option>
                <Option key="移动" value="移动">移动</Option>
          </Select>

          <label style={{ width: 200, marginRight: 16 }} >IP:</label>
          <Search className="search" onChange={(e) => {
            this.setState({ searchword: e.target.value});
          }} />
          <Button type="primary" onClick={this.onClickSearch}>
          查询
          </Button>
          <Button
            type="primary"
            className="create-btn"
            onClick={() => this.setState({ visible: true, currentId: 0, title: '新建' })}
          >
            新建
          </Button>
        </div>
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
          getIPList={this.getIPList}
        />
      </Card>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IPList);
