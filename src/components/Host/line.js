import React, { Component } from 'react';
import { Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/grid';
import 'echarts/lib/chart/line';
import moment from 'moment';

import {
  fetchIpHistory,
  fetchDomainHistory,
} from '../../services/api';
import { tmpdir } from 'os';

export default class ShowLine extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 父层更新时，才会发生调用
  componentWillReceiveProps(nextProps) {
    this.dataProc(nextProps.searchParams);  
  }

  // 一开始只会执行一次, render之前.
  componentWillMount(){
    this.dataProc(this.props.searchParams);  
  }
  

  componentDidMount = () => {
  }

  dataProc = (params) => {    
    console.log(38383838, params);
    this.getData(params)
      .then((res) => {
        const data = {};
        let markList = ["packet_loss", "response_time", "availability"];
        let country;
        let i = 0;
        for (;i < markList.length; i++) {
          country = markList[i];
          const rateData = res[country]
          for (const item of rateData) {
            const time = new Date(item.timestamp * 1000);
            if (data[country] === undefined) {
              data[country] = [];
            }
            data[country].push({
              value: [
                moment.unix(item.timestamp).format('YYYY/MM/DD HH:mm:ss'),
                item.value
              ]
            })
          }
        }
        this.initLine(data);
      });
  }

  getData = async (params) => {
    console.log("66 req map: ", params);
    let resp = {};
    if (params.role === "domainHistory") {
      const resp = await fetchDomainHistory(params.domain, params.province, params.isp, params.startTime, params.endTime);
      return resp
    }
    if (params.role === "ipHistory") {
      const resp = await fetchIpHistory(params.ip, params.startTime, params.endTime);
      return resp
    }
   return resp; 
  }

  initLine(data) {
    const quotaClass = [];
    const series = [];
    console.log("data:", data);
    for (const val in data) {
      quotaClass.push(val);
      console.log(8888, val);
      series.push({
        name: val,
        type: 'line',
        showSymbol: false,
        smooth: true,
        data: data[val]
      })
    }
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: quotaClass
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: [{
        type: 'time',
      }],
      yAxis: [{
        type: 'value',
        min: function (value) {
          return (value.min - 0.001).toFixed(3);
        },
        max: function (value) {
          return (value.max + 0.001).toFixed(3);
        }
      }],
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, {
        start: 0,
        end: 100,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: series
    };

    let myChart = echarts.init(this.ID)

    // myChart.showLoading();
    myChart.setOption(option);
    // myChart.hideLoading();
    window.onresize = function () {
      myChart.resize();
    }
  }

  render() {
    const { width = "100%", height = "500px" } = this.props
    return (
      <Card title="图表" className="m-t-16">
        <div ref={ID => this.ID = ID} style={{ width, height }}></div>
      </Card>
    )
  }
}