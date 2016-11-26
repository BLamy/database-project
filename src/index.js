import React from 'react';
import { render } from 'react-dom';
import { pipe } from 'ramda';
import { createStore, compose, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { reducer, epic, getRandomPapersFailed, didGetRandomPapers } from './model';
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
const store = createStore(reducer, undefined, reduxObservableMiddleware(epic));

// Get random papers
fetch('/search.json')
  .then(res => {
    if (res.status >= 200 && res.status < 300) {
      return res.json();
    }
    throw new Error('Failed to get random papers.');
  })
  .catch(pipe(getRandomPapersFailed, store.dispatch))
  .then(pipe(didGetRandomPapers, store.dispatch));

// Root Render
render(
  <MuiThemeProvider muiTheme={getMuiTheme({ palette })}>
    <Provider store={store}>
      <App store={store} />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
