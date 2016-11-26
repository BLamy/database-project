import { pipe, tap, omit, pickBy, is } from 'ramda';
const isFunction = is(Function);

/**
 * Will intercept an event and preventDefault then call the inner callback
 */
export const preventDefaultThen = fn => pipe(tap(e => e.preventDefault()), fn);

/**
 * Can pull all the actions out of a model
 */
export const getActionsFromModel = pipe(omit(['reducer', 'epic']), pickBy(isFunction));

/**
 * Can create reducers in a more convient syntax
 */
export const createReducer = (lookup, defaultState) => (state = defaultState, payload) => {
  const { type } = payload;
  if (isFunction(lookup[type])) {
    return lookup[type](state, payload);
  }
  if (isFunction(lookup.default)) {
    return lookup.default(state, payload);
  }
  return state;
};
