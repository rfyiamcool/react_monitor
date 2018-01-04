import { stringify } from 'qs';
import { request } from '../utils/request';
import Config from '../config/config';

let API_ROOT = Config.API_ROOT

// login
export function loginApi(body) {
  return request(`${API_ROOT}/login`, {
    method: 'POST',
    body: body
  });
}

// logout
export function logoutApi(body) {
  return request(`${API_ROOT}/logout`, {
    method: 'POST'
  });
}

// delete ip
export function DeleteIpById(id) {
  console.log("delete id", id);
  return request(`${API_ROOT}/dashboard/v1/customer_ips/${id}`, {
    method: 'DELETE',
  });
}

// add ip
export function AddIp(body) {
  return request(`${API_ROOT}/dashboard/v1/customer_ips`, {
    method: 'POST',
    body: body
  });
}

// release
export function getReleaseListApi(params) {
  return request(`${API_ROOT}/release?${stringify(params)}`);
}

export function createReleaseApi(body) {
  return request(`${API_ROOT}/release`, {
    method: 'POST',
    body: body
  });
}

export function getReleaseDetailApi(release_id) {
  return request(`${API_ROOT}/release/${release_id}`);
}

export function getProcessDetailApi(id) {
  return request(`${API_ROOT}/process/${id}`);
}

// 2.10 top 上面的那个信息统计
export function fetchDomainStats(domain) {
  return request(`${API_ROOT}/dashboard/v1/domains/${domain}/statistics`);
}

// 2.11 查询坏掉的节点
export function fetchBadNodes(domain) {
  return request(`${API_ROOT}/dashboard/v1/domains/${domain}/bad_nodes`);
}

// 2.5 获取所有的加速域名
export function fetchDomainList() {
  return request(`${API_ROOT}/dashboard/v2/domains`);
}

// 2.6 获取地图数据
export function fetchMapQualityByIsp(domain, isp) {
  console.log(domain, isp)
  return request(`${API_ROOT}/dashboard/v1/domains/${domain}/quality?isp=${isp}`);
}

export function getHostDetailApi(host_id) {
  return request(`${API_ROOT}/host/${host_id}`);
}

export function editHostListApi(body) {
  return request(`${API_ROOT}/host`, {
    method: 'POST',
    body: body
  });
}

export function deleteHostApi(host_id) {
  return request(`${API_ROOT}/host/${host_id}`, {
    method: 'DELETE'
  });
}

export function getHostGroupListApi(params) {
  return request(`${API_ROOT}/host_group?${stringify(params)}`);
}

export function getHostGroupDetailApi(host_group_id) {
  return request(`${API_ROOT}/host_group/${host_group_id}`);
}

export function editHostGroupApi(body) {
  return request(`${API_ROOT}/host_group`, {
    method: 'POST',
    body: body
  });
}

export function deleteHostGroupApi(host_id) {
  return request(`${API_ROOT}/host_group/${host_id}`, {
    method: 'DELETE'
  });
}

export function getHostSelectDataApi() {
  return request(`${API_ROOT}/host/all_for_select`);
}

export function getHostGroupSelectDataApi() {
  return request(`${API_ROOT}/host/all_for_select`);
}

// api: 2.1
export function fetchIPList(start, length, province, isp, word) {
  return request(`${API_ROOT}/dashboard/v1/customer_ips?start=${start}&length=${length}&searchword=${word}&province=${province}&isp=${isp}`, {
    method: 'GET'
  });
}

// api: 2.9
export function fetchIpHistory(ip, startTime, endTime) {
  return request(`${API_ROOT}/dashboard/v1/ips/${ip}/history_quality?start_date=${startTime}&end_date=${endTime}`, {
    method: 'GET'
  });
}

// doc: api: 2.8
export function fetchDomainHistory(domain, province, isp, startTime, endTime) {
  console.log(224, domain, province, isp, startTime);
  return request(`${API_ROOT}/dashboard/v1/domains/${domain}/history_quality?province=${province}&isp=${isp}&start_date=${startTime}&end_date=${endTime}`, {
    method: 'GET'
  });
}

// api: 2.7
export function fetchInfoByDomain(domain, province, isp) {
  return request(`${API_ROOT}/dashboard/v1/domains/${domain}/ip?province=${province}&isp=${isp}`, {
    method: 'GET'
  });
}

export function getDomainProvinceIPList(domain, province, isp) {
  return request(`${API_ROOT}/dashboard/v1/domain/${domain}/quality/ip?province=${province}&isp=${isp}`, {
    method: 'GET'
  });
}

