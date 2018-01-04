import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { push } from 'react-router-redux';

import { store, history } from './store';
import { setToken } from './utils/request';

import BasicLayout from './layouts/BasicLayout';
import LoginLayout from './layouts/LoginLayout';

export default class App extends Component {
  render() {
    // const token = window.localStorage.getItem('token');
    // if (token) {
    //   setToken(token);
    // } else {
    //   store.dispatch(push(`/login`));
    // }
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/login' component={LoginLayout} />
            <Route path='/' component={BasicLayout} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    )
  }
}
