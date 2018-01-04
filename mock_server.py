#-*- coding:utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS

import sys
reload(sys)
sys.setdefaultencoding("utf-8")



app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['GET', 'POST'])
def login():
    d = {
        "auth": "success",
        "token": "123123"
    }

    return jsonify(d)


@app.route('/dashboard/v1/customer_ips', methods=['POST'])
def add_ip():
    d = {
        "id": 101,
        "province": "北京",
        "isp": "联通",
        "ip": "1.1.1.1"
    }
    return jsonify(d)


@app.route('/dashboard/v1/customer_ips/<data_id>', methods=['DELETE'])
def delete_ip(data_id):
    return jsonify()


# api 2.8
@app.route('/dashboard/v1/domains/<domain>/history_quality')
def domain_isp_history(domain):
    d = {
        "domain": "x.com",
        "province": "辽宁",
        "isp": "移动",
        "packet_loss": [
            {
            "value": 101, 
            "timestamp": 1512057600
            }, 
            {
            "value": 33, 
            "timestamp": 1512144000
            }, 
            {
            "value": 111, 
            "timestamp": 1512230400
            }, 
            {
            "value": 177, 
            "timestamp": 1512316800
            }, 
            {
            "value": 77, 
            "timestamp": 1512403200
            }
        ],
        "response_time": [
            {
            "value": 101, 
            "timestamp": 1512057600
            }, 
            {
            "value": 33, 
            "timestamp": 1512144000
            }, 
            {
            "value": 111, 
            "timestamp": 1512230400
            }, 
            {
            "value": 177, 
            "timestamp": 1512316800
            }, 
            {
            "value": 281, 
            "timestamp": 1512403200
            }
        ],
        "availability": [
            {
            "value": 241, 
            "timestamp": 1512057600
            }, 
            {
            "value": 133, 
            "timestamp": 1512144000
            }, 
            {
            "value": 110, 
            "timestamp": 1512230400
            }, 
            {
            "value": 127, 
            "timestamp": 1512316800
            }, 
            {
            "value": 312, 
            "timestamp": 1512403200
            }
        ],
    }
    return jsonify(d)


# curl "http://127.0.0.1:8088/dashboard/v1/domain/163.com/quality/ip?province=广东&isp=移动"
@app.route('/dashboard/v1/domain/<domain>/quality/ip', methods=['GET', 'POST'])
def show_province(domain):
    d = {
        "domain": "x.com",
        "province": "广东",
        "isp": "移动",
        "data": [
            {
                "id": 11,
                "domain": "x.com",
                "province": "广东",
                "isp": "移动",
                "ip": "192.168.1.1",
                "updated_at": "2017-11-20"
            },
            {
                "id": 12,
                "domain": "x.com",
                "province": "广东",
                "isp": "移动",
                "ip": "192.168.1.1",
                "updated_at": "2017-11-20"
            },
        ]
    }

    return jsonify(d)


# 2.1
@app.route('/dashboard/v1/customer_ips', methods=['GET', 'POST'])
def show_ip_list():
    # curl "http://127.0.0.1:8088/inspector/v1/customer_ips?start=0&length=10&searchword=192&province=北京&isp=联通"
    d = {
        "total_count": 100,
        "ip_list": [
            {
                "id": 1,
                "ip": "1.1.1.1",
                "province": "北京",
                "isp": "联通",
                "updated_at": "2017-11-21 08:00:00"
            },
            {
                "id": 2,
                "ip": "2.2.2.2",
                "province": "北京",
                "isp": "联通",
                "updated_at": "2017-11-21 08:00:00"
            },
            {
                "id": 3,
                "ip": "3.3.3.3",
                "province": "北京",
                "isp": "联通",
                "updated_at": "2017-11-21 08:00:00"
            },
            {
                "id": 4,
                "ip": "4.4.4.4",
                "province": "北京",
                "isp": "联通",
                "updated_at": "2017-11-21 08:00:00"
            },
            {
                "id": 5,
                "ip": "5.5.5.5",
                "province": "北京",
                "isp": "联通",
                "updated_at": "2017-11-21 08:00:00"
            },
            {
                "id": 6,
                "ip": "6.6.6.6",
                "province": "北京",
                "isp": "联通",
                "updated_at": "2017-11-21 08:00:00"
            },
            {
                "id": 7,
                "ip": "7.7.7.77",
                "province": "北京",
                "isp": "联通",
                "updated_at": "2017-11-21 08:00:00"
            },
            {
                "id": 8,
                "ip": "8.8.8.8",
                "province": "北京",
                "isp": "联通",
                "updated_at": "2017-11-21 08:00:00"
            }
        ]
    }

    return jsonify(d)


#
@app.route('/dashboard/v1/domains', methods=['GET'])
def get_domains():
    d = {
        "total_count": 1016,
        "domain_list": [
            "x.com",
            "y.com",
            "163.com",
            "taobao.com",
            "nima.com"
        ]
    }
    return jsonify(d)


@app.route('/dashboard/v1/domain/<domain>/quality', methods=['GET'])
def show_quality_domain(domain):
    d = {
        "domain": "a.com",
        "data": [
            {
                "id": 1,
                "domain": "a.com",
                "province": "北京",
                "isp": "移动",
                "packet_loss": 10,
                "response_time": 10,
                "availability": 90
            },
            {
                "id": 2,
                "domain": "a.com",
                "province": "辽宁",
                "isp": "移动",
                "packet_loss": 11,
                "response_time": 11,
                "availability": 89
            },
            {
                "id": 3,
                "domain": "a.com",
                "province": "山东",
                "isp": "移动",
                "packet_loss": 66,
                "response_time": 66,
                "availability": 66
            },
            {
                "id": 4,
                "domain": "a.com",
                "province": "上海",
                "isp": "移动",
                "packet_loss": 686,
                "response_time": 266,
                "availability": 166
            },
            {
                "id": 5,
                "domain": "a.com",
                "province": "吉林",
                "isp": "移动",
                "packet_loss": 816,
                "response_time": 566,
                "availability": 300
            },
            {
                "id": 6,
                "domain": "a.com",
                "province": "湖北",
                "isp": "移动",
                "packet_loss": 486,
                "response_time": 316,
                "availability": 496
            },
            {
                "id": 7,
                "domain": "a.com",
                "province": "新疆",
                "isp": "移动",
                "packet_loss": 486,
                "response_time": 316,
                "availability": 496
            },
            {
                "id": 8,
                "domain": "a.com",
                "province": "甘肃",
                "isp": "移动",
                "packet_loss": 412,
                "response_time": 388,
                "availability": 891
            },
            {
                "id": 9,
                "domain": "a.com",
                "province": "黑龙江",
                "isp": "移动",
                "packet_loss": 912,
                "response_time": 988,
                "availability": 991
            },
            {
                "id": 10,
                "domain": "a.com",
                "province": "山西",
                "isp": "移动",
                "packet_loss": 112,
                "response_time": 288,
                "availability": 191
            }
        ]
    }
    return jsonify(d)

# api 2.7
@app.route('/dashboard/v1/domains/<domain>/ip', methods=['GET', 'POST'])
def get_detail_info_by_domain(domain):
    d = {
        "total_count": 2,
        "domain": "a.com",
        "province": "北京",
        "isp": "移动",
        "data": [
            {
                "id": 1,
                "domain": "a.com",
                "province": "北京",
                "isp": "移动",
                "vendor": "自建",
                "ip": "1.1.1.1",
                "created_at": "2017-11-27T11:02:29+08:00",
                "updated_at": "2017-11-27T11:02:29+08:00"
            },
            {
                "id": 2,
                "domain": "a.com",
                "province": "北京",
                "isp": "移动",
                "vendor": "自建",
                "ip": "2.2.2.2",
                "created_at": "2017-11-27T11:03:07+08:00",
                "updated_at": "2017-11-27T11:03:07+08:00"
            }
        ]
    }
    return jsonify(d)


# api 2.9
@app.route('/dashboard/v1/ips/<ip>/history_quality', methods=['GET', 'POST'])
def show_edge_nodes(ip):
    d = {
        "ip": ip,
        "packet_loss": [
            {
            "value": 101, 
            "timestamp": 1512057600
            }, 
            {
            "value": 33, 
            "timestamp": 1512144000
            }, 
            {
            "value": 111, 
            "timestamp": 1512230400
            }, 
            {
            "value": 177, 
            "timestamp": 1512316800
            }, 
            {
            "value": 77, 
            "timestamp": 1512403200
            }
        ],
        "response_time": [
            {
            "value": 101, 
            "timestamp": 1512057600
            }, 
            {
            "value": 33, 
            "timestamp": 1512144000
            }, 
            {
            "value": 111, 
            "timestamp": 1512230400
            }, 
            {
            "value": 177, 
            "timestamp": 1512316800
            }, 
            {
            "value": 281, 
            "timestamp": 1512403200
            }
        ],
        "availability": [
            {
            "value": 241, 
            "timestamp": 1512057600
            }, 
            {
            "value": 133, 
            "timestamp": 1512144000
            }, 
            {
            "value": 110, 
            "timestamp": 1512230400
            }, 
            {
            "value": 127, 
            "timestamp": 1512316800
            }, 
            {
            "value": 312, 
            "timestamp": 1512403200
            }
        ],
    }
    return jsonify(d)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8088, debug=True)
