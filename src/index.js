import React from 'react';
import 'antd/dist/antd.css';
import { render } from 'react-dom';
import { pipe } from 'ramda';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { combineEpics } from 'redux-observable';

import { reducer as searchReducer, epic as searchEpic } from './model/search';
import { reducer as userReducer, epic as loginEpic } from './model/user';
import { epic as paperEpic } from './model/papers';

import App from './controller';

// Polyfills
require('es6-promise').polyfill();
require('isomorphic-fetch');
require('react-tap-event-plugin')(); // http://www.material-ui.com/#/get-started/installation

// Theme
const palette = {
  primary1Color: '#F36E21',
  accent1Color: '#513127'
};

// Redux Store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
const reduxObservableMiddleware = pipe(createEpicMiddleware, applyMiddleware, composeEnhancers);
const middleware = reduxObservableMiddleware(combineEpics(loginEpic, searchEpic, paperEpic));
const reducer = combineReducers({
  search: searchReducer,
  user: userReducer
});
const store = createStore(reducer, undefined, middleware);

// Root Render
render(
  <MuiThemeProvider muiTheme={getMuiTheme({ palette })}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
