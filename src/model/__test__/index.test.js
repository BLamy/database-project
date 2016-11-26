import assert from 'power-assert';
import fetchMock from 'fetch-mock';
import { reducer, epic, attemptLogin, logout, loginSuccess, loginFailed } from '../';

import configureMockStore from 'redux-mock-store';

import { createEpicMiddleware } from 'redux-observable';

const epicMiddleware = createEpicMiddleware(epic);
const mockStore = configureMockStore([epicMiddleware]);

describe('Reducer', () => {
  it('loginSuccess - should set user properly', () => {
    const state = {
      user: null
    };
    const actual = reducer(state, loginSuccess({ username: 'foo' }));
    const expected = {
      user: {
        username: 'foo'
      }
    };
    assert.deepEqual(actual, expected);
  });

  it('loginFailed - should set error', () => {
    const state = {
      user: {
        username: 'foo'
      }
    };
    const actual = reducer(state, loginFailed('Failed to login'));
    const expected = {
      user: null,
      err: 'Failed to login'
    };
    assert.deepEqual(actual, expected);
  });

  it('logout - should set user properly', () => {
    const state = {
      user: {
        username: 'foo'
      }
    };
    const actual = reducer(state, logout());
    const expected = {
      user: null
    };
    assert.deepEqual(actual, expected);
  });
});

/* eslint func-names: ["error", "never"] */
describe('Epics', () => {
  it('', done => {
    fetchMock.post('/login', { username: 'foo', group: 'student' }, true);
    const store = mockStore({ user: null });
    store.dispatch(attemptLogin('foo', 'bar'));
    setTimeout(() => {
      assert.equal(store.getActions().length, 2);
      assert.deepEqual(store.getActions()[0].type, 'client/ATTEMPT_LOGIN');
      assert.deepEqual(store.getActions()[1].type, 'client/LOGIN_SUCCESS');
      fetchMock.restore();
      done();
    }, 0);
  });
});
