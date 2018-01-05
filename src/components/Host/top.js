import React, { Component } from 'react';
import { Card, Table} from 'antd';
import { Link } from 'react-router-dom';


import {
  fetchMapQualityByIsp,
} from '../../services/api';

export default class ShowTop extends Component  {

  constructor(props) {
    super(props);
    this.state = {
        title: 'TOP',
        quota: '',
        data: []
    };

    this.columns = [
        {
          title: '省份',
          dataIndex: 'province',
          width: '20%',
          key: 'province'
        }, {
          title: '数值',
          dataIndex: 'value',
          width: '20%',
          key: 'value',
        }, {
          title: '操作',
          width: '20%',
          render: (text, data) => {
            let url = "/host_manage/host?province="+data.province+"&domain="+data.domain+"&isp="+data.isp;
            return (
              <Link to={url}>
                查看
              </Link>
            );
        }
      }
    ]
  }

  // 每次调用都会触发, 生命周期在render之前发生.
  componentWillReceiveProps(nextProps) {
    this.dataProc(nextProps.searchParams);
  }

  // render之后的生命周期
  componentDidMount = () => {
  }

  dataProc = (params) => {
    if (params["quota"] === undefined){
        console.log("first req top");
        return;
    }
    this.getData(params)
      .then((res) => {
        let data = [];
        for (const item of res["data"]) {
          data.push({"province": item.province, "value": item[params.quota], "isp": item.isp, "domain": item.domain})
        }
        let value = params.quota
        let topStr = "TOP"
        switch (value) {
        case "availability":
          // 升序
          data.sort( function(a, b){   
              return parseInt(a["value" ]) > parseInt(b["value" ]) ? 1 : parseInt(a[ "value"]) == parseInt(b[ "value" ]) ? 0 : -1;   
          });  
          topStr = "TOP (" + value + " 升序)";
          this.setState({'title': topStr});
          break;
        case "response_time":
        case "packet_loss":
          // 降序
          data.sort( function(a, b){   
              return parseInt(a["value" ]) < parseInt(b["value" ]) ? 1 : parseInt(a[ "value"]) == parseInt(b[ "value" ]) ? 0 : -1;   
          });
          topStr = "TOP (" + value + " 降序)";
          this.setState({'title': topStr});
          break;
        }

        this.setState({data: data});
      });
  }

  getData = async (params) => {
    console.log("req map: ", params);
    return await fetchMapQualityByIsp(params.domain, params.isp);
  }

  render() {
    return (
        <Card title={this.state.title} className="card">
            <Table
            className="table"
            columns={this.columns}
            dataSource={this.state.data}
            />
        </Card>
    )
  }
}