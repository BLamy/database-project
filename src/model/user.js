import { createReducer } from '../util';
import { combineEpics } from 'redux-observable';
import { is } from 'ramda';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/pluck';

// Meta
export const NAMESPACE = 'search';
const DEFAULT_STATE = {
  name: null,
  isAdmin: false,
  Authorization: null
};

// Constants
const ATTEMPT_LOGIN = `${NAMESPACE}/ATTEMPT_LOGIN`;
const LOG_OUT = `${NAMESPACE}/LOG_OUT`;
const LOGIN_SUCCESS = `${NAMESPACE}/LOGIN_SUCCESS`;
const LOGIN_FAILED = `${NAMESPACE}/LOGIN_FAILED`;
const IS_ADMIN = `${NAMESPACE}/IS_ADMIN`;

// Actions
export const attemptLogin = (username, password) => ({ type: ATTEMPT_LOGIN, username, password });
export const loginSuccess = (username, password) => ({ type: LOGIN_SUCCESS, username, password });
export const setAsAdmin = () => ({ type: IS_ADMIN })
export const loginFailed = err => ({ type: LOGIN_FAILED, err });
export const logout = () => ({ type: LOG_OUT });

// Reducer
export const reducer = createReducer({
  [LOGIN_SUCCESS]: (state, { username, password }) => ({
    ...state,
    name: username,
    Authorization: `Basic ${btoa(`${username}:${password}`)}`
   }),
  [LOGIN_FAILED]: (state, { err }) => ({ ...state, name: null, Authorization: null, err }),
  [IS_ADMIN]: state => ({ ...state, isAdmin: true }),
  [LOG_OUT]: state => ({ ...state, user: null, Authorization: null }),
}, DEFAULT_STATE);

// Side-effects
const login = (path, username, password) =>
  fetch(`${path}/index.php`, {
    method: 'post',
    headers: {
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    if (res.status === 200) {
      return { username, password };
    }
    return null;
  });

// Epic
const loginEpic = action$ =>
  action$
    .ofType(ATTEMPT_LOGIN)
    .mergeMap(({ username, password }) => login('login', username, password))
    .map(results => {
      if (!results) {
        return loginFailed('Username or Password invalid.');
      }
      return loginSuccess(results.username, results.password);
    });

const checkAdminEpic = action$ =>
  action$
    .ofType(LOGIN_SUCCESS)
    .mergeMap(({ username, password }) => login('admin', username, password))
    .filter(is(Object))
    .map(setAsAdmin)

export const epic = combineEpics(loginEpic, checkAdminEpic)
