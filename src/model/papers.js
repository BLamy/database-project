import { createReducer } from '../util';
import { combineEpics } from 'redux-observable';
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
export const NAMESPACE = 'papers';
const DEFAULT_STATE = {
  id: null,
  title: null,
  citation: null,
  abstract: null,
  isEditing: false,
  authors: []
};

// Constants
const ADD_PAPER = `${NAMESPACE}/ADD_PAPER`;
const UPDATE_PAPER = `${NAMESPACE}/UPDATE_PAPER`;
const SET_ACTIVE_PAPER = `${NAMESPACE}/SET_ACTIVE_PAPER`;
const ADD_PAPER_FAILED = `${NAMESPACE}/ADD_PAPER_FAILED`;
const CLEAR_ACTIVE_PAPER = `${NAMESPACE}/CLEAR_ACTIVE_PAPER`;

// Actions
export const addPaper = (title, citation, abstract) => ({ type: ADD_PAPER, title, citation, abstract });
export const setActivePaper = (id, title, citation, abstract, authors, isEditing) =>
  ({ type: SET_ACTIVE_PAPER, id, title, citation, abstract, authors, isEditing });
export const addPaperFailed = err => ({ type: SET_ACTIVE_PAPER, err });
export const clearActivePaper = () => ({ type: CLEAR_ACTIVE_PAPER });

// Reducer
export const reducer = createReducer({
  [ADD_PAPER_FAILED]: (state, { err }) => ({ ...state, err }),
  [SET_ACTIVE_PAPER]: (state, { id, title, citation, abstract, authors, isEditing }) => ({
    ...state, id, title, citation, abstract, authors, isEditing
  }),
  [CLEAR_ACTIVE_PAPER]: state => ({
    ...state, id: null, title: null, citation: null, abstract: null, authors: [], isEditing: false
  }),
}, DEFAULT_STATE);

// Side-effects
const paperRequest = (method, Authorization, title, citation, abstract) => fetch(`admin/paper.php`, {
  method,
  headers: {
    'Authorization': Authorization,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ title, citation, abstract })
}).then(res => {
  if (res.status === 200) {
    return res.json();
  }
  return Promise.resolve(null);
});

// Epic
const addPaperEpic = (action$, store) =>
  action$.ofType(ADD_PAPER)
    .mergeMap(({ title, citation, abstract }) =>
      paperRequest('post', store.getState().user.Authorization, title, citation, abstract)
    )
    .map(results => {
      if (!results) {
        return addPaperFailed("Add Paper Failed");
      }
      return setActivePaper(0, results.title, results.citation, results.abstract, results.authors, false);
    });

const updatePaperEpic = (action$, store) =>
  action$.ofType(UPDATE_PAPER)
    .mergeMap(({ title, citation, abstract }) =>
      paperRequest('put', store.getState().user.Authorization, title, citation, abstract)
    )
    .map(results => {
      if (!results) {
        return addPaperFailed("Add Paper Failed");
      }
      return setActivePaper(0, results.title, results.citation, results.abstract, results.authors, false);
    });

export const epic = combineEpics(addPaperEpic, updatePaperEpic);
