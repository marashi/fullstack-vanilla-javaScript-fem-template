import { describe, it, before, mock } from 'node:test';
import Controller from '../src/shared/controller.js';
import assert from 'node:assert';
import ViewBase from '../src/shared/viewBase.js';
import { init } from 'browser-sync';

function generateView() {
  class View extends ViewBase {
    render = mock.fn();
    addRow = mock.fn();
    notify = mock.fn();
    configureFormSubmit = mock.fn();
    configureFormClear = mock.fn();
    resetForm = mock.fn();
  }

  return new View();
}

describe('Controller test suite', () => {
  let _controller;
  let view;
  before(() => {
    view = generateView();
    _controller = Controller.init({ view });
  });

  it('#init', () => {
    const view = generateView();
    _controller = Controller.init({ view });
    assert(view.configureFormSubmit.mock.calls.length, 1);
    assert(view.configureFormClear.mock.calls.length, 1);
    const renderMock = view.render.mock;
    assert(renderMock.calls.length, 1);
    const initialData = [
      { name: 'Alice', age: 34, email: 'a@mm.com' },
      { name: 'Bob', age: 24, email: 'ss@d.com' },
      { name: 'Charlie', age: 45, email: 'dscf@sd.com' },
    ];
    assert.deepStrictEqual(renderMock.calls[0].arguments[0], initialData);
  });

  //   it('should notify user if data is invalid', () => {
  //     const notify = view.notify;
  //     _controller['#onSubmit']({ name: '', age: '', email: '' });
  //     assert(notify.mock.calls.length, 1);
  //     assert(notify.mock.calls[0].arguments, [
  //       { msg: 'Invalid data', isError: true },
  //     ]);
  //   });

  //   it('should add row if data is valid', () => {
  //     const addRow = view.addRow;
  //     _controller['#onSubmit']({ name: 'Alice', age: 34, email: 'aa@aa.com' });
  //     assert(addRow.mock.calls.length, 1);
  //     assert(addRow.mock.calls[0].arguments, [
  //       { name: 'Alice', age: 34, email: '' },
  //     ]);
  //   });
});
