import { createReducer } from '../util';
import { combineEpics } from 'redux-observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/debounceTime';

// Meta
export const NAMESPACE = 'client';
const DEFAULT_STATE = {
  user: null,
  searchResults: [],
  randomPapers: []
};

// Constants
const ATTEMPT_LOGIN = `${NAMESPACE}/ATTEMPT_LOGIN`;
const LOG_OUT = `${NAMESPACE}/LOG_OUT`;
const LOGIN_SUCCESS = `${NAMESPACE}/LOGIN_SUCCESS`;
const LOGIN_FAILED = `${NAMESPACE}/LOGIN_FAILED`;

const SEARCH_TEXT_CHANGED = `${NAMESPACE}/SEARCH_TEXT_CHANGED`;
const SEARCH_RESULTS = `${NAMESPACE}/SEARCH_RESULTS`;
const SEARCH_FAILED = `${NAMESPACE}/SEARCH_FAILED`;

const RANDOM_PAPERS = `${NAMESPACE}/RANDOM_PAPERS`;
const RANDOM_PAPERS_FAILED = `${NAMESPACE}/RANDOM_PAPERS_FAILED`;

// Actions
export const attemptLogin = (username, password) => ({ type: ATTEMPT_LOGIN, username, password });
export const loginSuccess = user => ({ type: LOGIN_SUCCESS, user });
export const loginFailed = err => ({ type: LOGIN_FAILED, err });
export const logout = () => ({ type: LOG_OUT });

export const searchTextChanged = text => ({ type: SEARCH_TEXT_CHANGED, text });
export const didGetSearchResults = searchResults => ({ type: SEARCH_RESULTS, searchResults });
export const searchFailed = err => ({ type: SEARCH_FAILED, err });

export const didGetRandomPapers = randomPapers => ({ type: RANDOM_PAPERS, randomPapers });
export const getRandomPapersFailed = err => ({ type: RANDOM_PAPERS_FAILED, randomPapers: [], err });

// Reducer
export const reducer = createReducer({
  [LOGIN_SUCCESS]: (state, { user }) => ({ ...state, user }),
  [LOGIN_FAILED]: (state, { err }) => ({ ...state, user: null, err }),
  [LOG_OUT]: state => ({ ...state, user: null }),

  [SEARCH_RESULTS]: (state, { searchResults }) => ({ ...state, searchResults }),
  [SEARCH_FAILED]: state => ({ ...state, searchResults: [] }),

  [RANDOM_PAPERS]: (state, { randomPapers }) => ({ ...state, randomPapers }),
  [RANDOM_PAPERS_FAILED]: (state, { err }) => ({ ...state, randomPapers: [], err }),
}, DEFAULT_STATE);

// Side-effects
const login = ({ username, password }) =>
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

const search = query => fetch('/search.json');
// fetch('/search', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({ query })
// })

// Epic
const loginEpic = action$ =>
  action$
    .ofType(ATTEMPT_LOGIN)
    .mergeMap(login)
    .mergeMap(res => {
      if (res.status >= 200 && res.status < 300) {
        return res.json();
      }
      throw new Error('Username or Password invalid.');
    })
    .catch(() => loginFailed('Username or Password invalid.'))
    .map(loginSuccess);

const searchEpic = action$ =>
  action$
    .ofType(SEARCH_TEXT_CHANGED)
    .distinctUntilKeyChanged()
    .debounceTime(150)
    .mergeMap(search)
    .mergeMap(res => {
      if (res.status >= 200 && res.status < 300) {
        return res.json();
      }
      throw new Error('Search Failed');
    })
    .catch(() => searchFailed('Search Failed'))
    .map(didGetSearchResults);

export const epic = combineEpics(loginEpic, searchEpic);
