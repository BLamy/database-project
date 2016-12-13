import { createReducer } from '../util';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/pluck';

// Meta
export const NAMESPACE = 'search';
const DEFAULT_STATE = {
  mode: 'papers',
  results: []
};

// Constants
const SEARCH_TEXT_CHANGED = `${NAMESPACE}/SEARCH_TEXT_CHANGED`;
const SEARCH_RESULTS = `${NAMESPACE}/SEARCH_RESULTS`;
const SEARCH_FAILED = `${NAMESPACE}/SEARCH_FAILED`;
const SEARCH_MODE_CHANGED = `${NAMESPACE}/SEARCH_MODE_CHANGED`;

// Actions
export const searchTextChanged = text => ({ type: SEARCH_TEXT_CHANGED, text });
export const didGetSearchResults = results => ({ type: SEARCH_RESULTS, results });
export const searchFailed = err => ({ type: SEARCH_FAILED, err });
export const updateSearchMode = mode => ({ type: SEARCH_MODE_CHANGED, mode });

// Reducer
export const reducer = createReducer({
  [SEARCH_RESULTS]: (state, { results }) => ({ ...state, results }),
  [SEARCH_FAILED]: state => ({ ...state, results: [] }),
  [SEARCH_MODE_CHANGED]: (state, { mode }) => ({
    ...state,
    mode: mode === 'faculty' ? 'faculty' : 'papers'
   }),
}, DEFAULT_STATE);

// Side-effects
const search = (method, query) => fetch(`public/search.php?method=${method}&q=${query}`);

// Epic
export const epic = (action$, store) =>
  action$.ofType(SEARCH_TEXT_CHANGED).pluck('text')
    .debounceTime(150)
    .mergeMap(query => search(store.getState().search.mode, query))
    .mergeMap(res => {
      if (res.status >= 200 && res.status < 300) {
        return res.json();
      }
      return Promise.resolve(null);
    })
    .map(results => {
      if (!results) {
        return searchFailed("Search Failed");
      }
      return didGetSearchResults(results);
    });
