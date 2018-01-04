import fetch from 'isomorphic-fetch';
import { notification } from 'antd';
import { store } from '../store';
import { push } from 'react-router-redux';

// let base64 = require('base-64');
let token = null;

function checkStatus(response) {
  if (response.status === 403) {
    store.dispatch(push(`/login`));
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText,
  });
  const error = new Error(response.statusText);
  error.response = response;
  console.log(error);
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export const request = (url, options) => {
  const defaultOptions = {
    // credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  // console.log(token)
  if (token !== null) {
    newOptions.headers = { ...newOptions.headers, Authorization: token };
  }
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      // 'Authorization': 'Basic' + base64.encode(username + ":" + password)
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      // if ('stack' in error && 'message' in error) {
      //   notification.error({
      //     message: `请求错误: ${url}`,
      //     description: error.message,
      //   });
      // }
      error.error = true;
      return error;
    });
}

export const setToken = (_token) => { token = _token };
