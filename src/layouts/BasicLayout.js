import React, { Component } from 'react';
import { Layout, Menu, Icon, Badge, Avatar } from 'antd';
import { Route, Switch, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  GET_PROCESS_TPL_SELECT_DATA,
  GET_HOST_SELECT_DATA,
  GET_HOST_GROUP_TPL_SELECT_DATA,
  GET_HOST_GORUP_HOST_RELATION_SELECT_DATA,
  GET_SALT_PATH_SELECT_DATA,
  UPDATE_FIELD_SIDER,
} from '../actionTypes';
import { store } from '../store';
import { push } from 'react-router-redux';

import {
  logoutApi,
  getProcessTplSelectData,
  getHostSelectDataApi,
  getHostGroupSelectDataApi,
  getHostGroupHostRelationSelectDataApi,
  getDomainProvinceIPList,
} from '../services/api';

import Release from '../components/Release/Release';
import ReleaseList from '../components/Release/ReleaseList';
import Process from '../components/Process/Process';
import ProcessList from '../components/Process/ProcessList';
import FileList from "../components/File/FileList";
import HostList from '../components/Host/HostList';
import BadNodeList from '../components/Host/BadNode';
import IPList from '../components/Host/IPList';
import IpHistoryCharts from '../components/Host/IpHistory';
import ShowMapQuality from '../components/Host/ShowMapQuality';
import HostGroupList from '../components/Host/HostGroupList';
import DomainHistory from '../components/Host/DomainHistory';

import './BasicLayout.less';
import logo from '../../assets/images/logo.png';

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;


const mapStateToProps = state => ({
  common: state.common
});

const mapDispatchToProps = dispatch => ({
  getProcessTplSelectData: (data) => dispatch({ type: GET_PROCESS_TPL_SELECT_DATA, data }),
  getHostSelectData: (data) => dispatch({ type: GET_HOST_SELECT_DATA, data }),
  getHostGroupSelectData: (data) => dispatch({ type: GET_HOST_GROUP_TPL_SELECT_DATA, data }),
  getHostGroupHostRelationSelectData: (data) => dispatch({ type: GET_HOST_GORUP_HOST_RELATION_SELECT_DATA, data }),
  getSaltPathSelectData: (data) => dispatch({ type: GET_SALT_PATH_SELECT_DATA, data }),
  updateField: (key, value) => dispatch({ type: UPDATE_FIELD_SIDER, key, value }),
});

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,  // 边栏收缩状态
    }
  }
  componentWillMount = async () => {
    const splitPaths = this.props.location.pathname.split('/');
    if (splitPaths.length >= 3) {
      const path1 = [splitPaths.slice(0, 2).join('/')];
      const path2 = [splitPaths.slice(0, 3).join('/')];
      this.props.updateField('siderOpenKeys', path1);
      this.props.updateField('siderSelectKey', path2);
    }
  }

  menuClick = async (e) => {
    // switch (e.key) {
    //   case 'settings':
    //     break;
    //   case 'logout':
    //     await logoutApi();
    //     window.localStorage.removeItem('token');
    //     store.dispatch(push(`/login`));
    //     break;
    //   default:
    //     console.error('wrong option');
    // }
  }

  render() {
    return (
      <Layout className="sider">
        <Sider
          collapsed={this.state.collapsed}
        >
          <div className='logo'>
            <img src={logo} alt='logo' />
            {this.state.collapsed ? '' : <span>AirMonitor</span>}
          </div>
          <Menu
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
            selectedKeys={this.props.common.siderSelectKey}
            openKeys={this.props.common.siderOpenKeys}
            onSelect={(e) => this.props.updateField('siderSelectKey', e.selectedKeys)}
            onOpenChange={(value) => this.props.updateField('siderOpenKeys', value)}
          >
            <Menu.Item key="/ip_manage/ip">
              <Link to="/ip_manage/ip">
                <Icon type="rocket" />
                <span>客户IP管理</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="/show/map">
              <Link to="/show/map">
                <Icon type="global" />
                <span style={{ display: 'inline' }}>
                地图趋势
                </span>
              </Link>
            </Menu.Item>

            <Menu.Item key="/show/history/domain">
              <Link to="/show/history/domain">
                <Icon type="line-chart" />
                <span style={{ display: 'inline' }}>
                域名服务质量趋势
                </span>
              </Link>
            </Menu.Item>

          </Menu>
        </Sider>
        <Layout>
          <Header className="header">
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'verticle-left' : 'verticle-right'}
              onClick={() => this.setState({ collapsed: !this.state.collapsed })}
            />
            <Menu
              mode="horizontal"
              className="right"
              onClick={this.menuClick}
            >
              <SubMenu title={<span className="avatar"><Avatar>U</Avatar>test_user</span>}>
                <Menu.Item key="setting"><Icon type="setting" />个人设置</Menu.Item>
                <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
              </SubMenu>
            </Menu>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Switch>
              <Route path="/release_manage/process/:process_id/:step_index" component={Process} />
              <Route path="/release_manage/process/:process_id" component={Process} />
              <Route path="/release_manage/process" component={ProcessList} />
              <Route path="/release_manage/common/:release_id" component={Release} />
              <Route path="/release_manage/common" component={ReleaseList} />
              <Route path="/file_manage" component={FileList} />
              <Route path="/host_manage/host" component={HostList} />
              <Route path="/ip_manage/ip" component={IPList} />
              <Route path="/show/bad_nodes" component={BadNodeList} />
              <Route path="/show/history/ip" component={IpHistoryCharts} />
              <Route path="/show/history/domain" component={DomainHistory} />
              <Route path="/show/map" component={ShowMapQuality} />
              <Route path="/host_manage/host_group" component={HostGroupList} />
              <Route path="/" component={ShowMapQuality} />
            </Switch>
          </Content>
          <Footer className="footer">
            air-monitor ©2017 Created by dev
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicLayout);
