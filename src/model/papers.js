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
export const NAMESPACE = 'papers';
const DEFAULT_STATE = {};

// Constants
const ADD_PAPER = `${NAMESPACE}/ADD_PAPER`;

// Actions
export const addPaper = (title, citation, abstract) => ({ type: ADD_PAPER, title, citation, abstract });

// Side-effects
const addPaperRequest = (Authorization, title, citation, abstract) => fetch(`admin/paper.php`, {
  method: 'post',
  headers: {
    'Authorization': Authorization,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ title, citation, abstract })
});

// Epic
export const epic = (action$, store) =>
  action$.ofType(ADD_PAPER)
    .mergeMap(({ title, citation, abstract }) =>
      addPaperRequest(store.getState().user.Authorization, title, citation, abstract)
    ).filter(() => 1 === 2);
    // .map(results => {
    //   if (!results) {
    //     return searchFailed("Add Paper Failed");
    //   }
    //   return didGetSearchResults(results);
    // });
