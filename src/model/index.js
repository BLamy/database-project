import { createReducer } from '../util';
import { combineEpics } from 'redux-observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/pluck';

// Meta
export const NAMESPACE = 'client';
const DEFAULT_STATE = {
  user: null,
  searchMode: 'papers',
  searchResults: [],
  randomPapers: []
};

// Constants
const SEARCH_TEXT_CHANGED = `${NAMESPACE}/SEARCH_TEXT_CHANGED`;
const SEARCH_RESULTS = `${NAMESPACE}/SEARCH_RESULTS`;
const SEARCH_FAILED = `${NAMESPACE}/SEARCH_FAILED`;
const SEARCH_MODE_CHANGED = `${NAMESPACE}/SEARCH_MODE_CHANGED`;

// Actions
export const searchTextChanged = text => ({ type: SEARCH_TEXT_CHANGED, text });
export const didGetSearchResults = searchResults => ({ type: SEARCH_RESULTS, searchResults });
export const searchFailed = err => ({ type: SEARCH_FAILED, err });
export const updateSearchMode = searchMode => ({ type: SEARCH_MODE_CHANGED, searchMode });

// Reducer
export const reducer = createReducer({
  [SEARCH_RESULTS]: (state, { searchResults }) => ({ ...state, searchResults }),
  [SEARCH_FAILED]: state => ({ ...state, searchResults: [] }),
  [SEARCH_MODE_CHANGED]: (state, { searchMode }) => ({
    ...state,
    searchMode: searchMode === 'faculty' ? 'faculty' : 'papers'
   }),
}, DEFAULT_STATE);

// Side-effects
const search = (method, query) => fetch(`search.php?method=${method}&q=${query}`);

// Epic
const searchEpic = (action$, store) =>
  action$.ofType(SEARCH_TEXT_CHANGED).pluck('text')
    .distinctUntilKeyChanged()
    .debounceTime(150)
    .mergeMap(query => search(store.getState().searchMode, query))
    .mergeMap(res => {
      if (res.status >= 200 && res.status < 300) {
        return res.json();
      }
      throw new Error('Search Failed');
    })
    .catch(searchFailed)
    .map(didGetSearchResults);

export const epic = combineEpics(searchEpic);
