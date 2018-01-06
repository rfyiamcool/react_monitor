import React, { Component } from 'react';
import { Card, Table, Input, Select, Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';

import {
  getHostGroupListApi,
  deleteHostGroupApi,
  getHostGroupSelectDataApi,
  getHostGroupHostRelationSelectDataApi,
} from '../../services/api';

import {
  GET_HOST_GROUP_TPL_SELECT_DATA,
  GET_HOST_GORUP_HOST_RELATION_SELECT_DATA,
} from '../../actionTypes';

import HostGroupModal from './HostGroupModal';

const { Search } = Input;

const mapStateToProps = state => ({
  ...state.common
});

const mapDispatchToProps = dispatch => ({
  getHostGroupSelectData: (data) => dispatch({ type: GET_HOST_GROUP_TPL_SELECT_DATA, data }),
  getHostGroupHostRelationSelectData: (data) => dispatch({ type: GET_HOST_GORUP_HOST_RELATION_SELECT_DATA, data }),
});

class HostGroupList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: '10%',
        key: 'id'
      }, {
        title: '名称',
        dataIndex: 'name',
        width: '35%',
        key: 'name'
      }, {
        title: '主机数量',
        dataIndex: 'hosts',
        width: '15%',
        key: 'hosts',
        render: (text) => text.length
      }, {
        title: '修改时间',
        dataIndex: 'updated_on',
        width: '20%',
        key: 'updated_on'
      },
      {
        title: '操作',
        width: '20%',
        render: (record) => {
          return (
            <span>
              <a onClick={() => this.setState({ visible: true, hostGroupId: record.id, title: record.name })}>编辑</a>
              <span className="ant-divider" />
              <Popconfirm
                title={"确认删除" + record.name + '?'}
                onConfirm={async () => {
                  await deleteHostGroupApi(record.id);
                  this.getHostGroupList(this.state);
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }
      }
    ];
    this.state = {
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      hostGroupCount: 0,

      hosGrouptList: [],
      visible: false,
      title: '',
      hostGroupId: 0,

      searchword: '',
    }
  }

  getHostGroupList = async (state) => {
    const start = (state.pageNum - 1) * state.pageSize;
    const length = state.pageSize;
    const searchword = state.searchword;
    this.setState({ tableLoading: true });
    // todo 以下4个步骤加执行条件，host的也是如此
    const resp_host_group = await getHostGroupSelectDataApi();
    const resp_host_group_host_relation = await getHostGroupHostRelationSelectDataApi();
    this.props.getHostGroupHostRelationSelectData(resp_host_group_host_relation.data);
    this.props.getHostGroupSelectData(resp_host_group.data);
    const resp = await getHostGroupListApi({ start, length, searchword });
    this.setState({
      hosGrouptList: resp.data,
      hostGroupCount: resp.total_count,
      tableLoading: false,
    })
  }

  componentDidMount = () => {
    this.getHostGroupList(this.state);
  }

  onTableChange = async (pagination, filters, sorter) => {
    const page = pagination.current;
    this.setState({ pageNum: page });
    await this.getHostGroupList({ ...this.state, pageNum: page });
  }

  render() {
    return (
      <Card title="主机管理" className="card">
        <div>
          <label>搜索名称:</label>
          <Search className="search" onSearch={(value) => {
            this.setState({ pageNum: 1, searchword: value });
            this.getHostGroupList({ ...this.state, searchword: value });
          }} />
          <Button
            type="primary"
            className="create-btn"
            onClick={() => this.setState({ visible: true, hostGroupId: 0, title: '新建' })}
          >
            新建
        </Button>
        </div>
        <Table
          className="table"
          loading={this.state.tableLoading}
          rowKey={record => record.id}
          columns={this.columns}
          dataSource={this.state.hosGrouptList}
          onChange={this.onTableChange}
          pagination={{
            current: this.state.pageNum,
            pageSize: this.state.pageSize,
            total: this.state.hostGroupCount
          }}
        />
        <HostGroupModal
          visible={this.state.visible}
          currentId={this.state.hostGroupId}
          title={this.state.title}
          onCancel={() => this.setState({ visible: false })}
          resetCurrentId={() => this.setState({ hostGroupId: 0 })}
          hostSelectData={this.props.hostSelectData}
          getHostGroupList={() => this.getHostGroupList(this.state)}
          timestamp={this.props.timestamp}
        />
      </Card>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HostGroupList);
