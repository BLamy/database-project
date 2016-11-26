import assert from 'power-assert';
import { keys } from 'ramda';
import { spy } from 'sinon';
import { preventDefaultThen, getActionsFromModel, createReducer } from '../';
import * as duck from './fixtures';

describe('functions', () => {
  it('...preventDefaultThen', () => {
    const fn = spy();
    const e = { preventDefault: spy() };
    preventDefaultThen(fn)(e);
    assert(e.preventDefault.called, 'should preventDefault');
    assert(fn.calledWith(e), 'should call callback');
  });

  it('...getActionsFromModel', () => {
    assert.equal(keys(getActionsFromModel(duck)).length, 1);
  });

  it('...createReducer', () => {
    const foobar = spy();
    const reducer = createReducer({ foobar });
    reducer({}, { type: 'foobar' });
    assert(foobar.called, 'should call foobar');
    assert.deepEqual(reducer({}, { type: 'unknown' }), {}, 'should be identity');
  });
});
