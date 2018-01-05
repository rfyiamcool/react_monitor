import React, { Component } from 'react';
import { Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/geo'
import 'echarts/lib/chart/map' //引入地图
import 'echarts/lib/component/tooltip';
import 'echarts/map/js/china';


import {
  fetchMapQualityByIsp,
} from '../../services/api';

export default class ShowMap extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      qualityClass: 'availability',
      data: [],
      confMap: {},
    };
  }

  // 每次调用都会触发, 生命周期在render之前发生.
  componentWillReceiveProps(nextProps) {
    this.dataProc(nextProps.searchParams);
  }

  // render之后的生命周期
  componentDidMount = () => {
  }

  dataProc = (params) => {
    this.getData(params)
      .then((res) => {
        let data = [];
        for (const item of res["data"]) {
          data.push({"name": item.province, "value": item[params.quota]})
        }
        this.getQuotaRange(params.quota)
        this.initMap(data, params)
      });
  }

  getData = async (params) => {
    console.log("req map: ", params);
    return await fetchMapQualityByIsp(params.domain, params.isp);
  }

  getQuotaRange= (value) => {
    var d = {};
    switch(value)
    {
      case "packet_loss":
        d = {
          type: "piecewise",
          min: 0,
          max: 100,
          pieces: [
            {gte: 0, lte: 5, color: '#87d64a'},
            {gte: 6, lte: 10, color: '#FFD700'},
            {gte: 11, lte: 20, color: '#e8a14a'},
            {gte: 21, lte: 100, color: '#f76740'},
          ],
          textStyle: {
              color: '#50a3ba'
          }
        }
        break;
      case "response_time":
        d = {
          type: "piecewise",
          min: 0,
          max: 2000,
          // 自动模式
          // splitNumber: 5,
          // color: ['#d94e5d','#c95f0e','#FFD700','#d6cb08','#14bc65'],
          pieces: [
            {gte: 0, lte: 50, color: '#87d64a'},
            {gte: 51, lte: 100, color: '#FFD700'},
            {gte: 101, lte: 300, color: '#e8a14a'},
            {gte: 301, lte: 2000, color: '#f76740'},
            {gt: 2000, color: '#2d2f33'},
          ],
          textStyle: {
              color: '#50a3ba'
          }
        }
        break;
      case "availability":
        d = {
          type: "piecewise",
          min: 0,
          max: 100,
          pieces: [
            {gte: 0, lte: 50, color: '#f76740'},
            {gte: 51, lte: 70, color: '#e8a14a'},
            {gte: 71, lte: 90, color: '#FFD700'},
            {gte: 91, lte: 100, color: '#87d64a'},
            // {value: 123, label: '说点什么', color: 'grey'},
          ],
          textStyle: {
              color: '#50a3ba'
          }
        }
    }
    this.setState({confMap: d});
  }

  initMap(data, params) {
    const option = {
      tooltip: {
        trigger: 'item'
      },
      // visualMap: {
      //   min: 0,
      //   max: 100,
      //   splitNumber: 5,
      //   color: ['#d94e5d','#c95f0e','#FFD700','#d6cb08','#14bc65'],
      //   textStyle: {
      //       color: '#50a3ba'
      //   }
      // },
      visualMap: this.state.confMap,
      series: [
        {
          name: '网络质量',
          type: 'map',
          mapType: 'china',
          roam: false,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          data: data,
        }
      ]
    };
    let myChart = echarts.init(this.ID)
    myChart.setOption(option);
    window.onresize = function () {
      myChart.resize();
    }
  }

  render() {
    const { width = "100%", height = "500px" } = this.props
    return (
      <Card title="Map" className="card">
        <div ref={ID => this.ID = ID} style={{ width, height }}></div>
      </Card>
    )
  }
}

// data: [
//   { name: '北京', value: Math.round(Math.random() * 1000) },
//   { name: '天津', value: Math.round(Math.random() * 1000) },
//   { name: '上海', value: Math.round(Math.random() * 1000) },
//   { name: '重庆', value: Math.round(Math.random() * 1000) },
//   { name: '河北', value: Math.round(Math.random() * 1000) },
//   { name: '河南', value: Math.round(Math.random() * 1000) },
//   { name: '云南', value: Math.round(Math.random() * 1000) },
//   { name: '辽宁', value: Math.round(Math.random() * 1000) },
//   { name: '黑龙江', value: Math.round(Math.random() * 1000) },
//   { name: '湖南', value: Math.round(Math.random() * 1000) },
//   { name: '安徽', value: Math.round(Math.random() * 1000) },
//   { name: '山东', value: Math.round(Math.random() * 1000) },
//   { name: '新疆', value: Math.round(Math.random() * 1000) },
//   { name: '江苏', value: Math.round(Math.random() * 1000) },
//   { name: '浙江', value: Math.round(Math.random() * 1000) },
//   { name: '江西', value: Math.round(Math.random() * 1000) },
//   { name: '湖北', value: Math.round(Math.random() * 1000) },
//   { name: '广西', value: Math.round(Math.random() * 1000) },
//   { name: '甘肃', value: Math.round(Math.random() * 1000) },
//   { name: '山西', value: Math.round(Math.random() * 1000) },
//   { name: '内蒙古', value: Math.round(Math.random() * 1000) },
//   { name: '陕西', value: Math.round(Math.random() * 1000) },
//   { name: '吉林', value: Math.round(Math.random() * 1000) },
//   { name: '福建', value: Math.round(Math.random() * 1000) },
//   { name: '贵州', value: Math.round(Math.random() * 1000) },
//   { name: '广东', value: Math.round(Math.random() * 1000) },
//   { name: '青海', value: Math.round(Math.random() * 1000) },
//   { name: '西藏', value: Math.round(Math.random() * 1000) },
//   { name: '四川', value: Math.round(Math.random() * 1000) },
//   { name: '宁夏', value: Math.round(Math.random() * 1000) },
//   { name: '海南', value: Math.round(Math.random() * 1000) },
//   { name: '台湾', value: Math.round(Math.random() * 1000) },
//   { name: '香港', value: Math.round(Math.random() * 1000) },
//   { name: '澳门', value: Math.round(Math.random() * 1000) }
// ]