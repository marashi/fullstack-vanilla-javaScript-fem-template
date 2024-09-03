import { describe, it, before } from 'node:test';
import Controller from '../src/shared/controller.js';
import View from '../src/platforms/web/view.js';
import assert from 'node:assert';

globalThis.window = {};

function getDocument(mock, inputs = {}) {
  globalThis.alert = mock.fn(() => {});
  globalThis.document = {
    querySelector: mock.fn((id) => ({
      value: inputs[id.replace('#', '')] ?? 'test',
      appendChild: mock.fn(() => {}),
      reset: mock.fn(() => {}),
      addEventListener: mock.fn((event, fn) => {
        // fn({
        //   preventDefault: mock.fn(() => {}),
        // });
      }),
    })),
    createElement: mock.fn((name) => ({
      classList: {
        add: mock.fn(() => {}),
      },
    })),
    addEventListener: mock.fn((event, fn) => {
      fn({
        preventDefault: mock.fn(() => {}),
      });
    }),
  };

  return globalThis.document;
}

describe('Web app test suite', () => {
  let _controller;
  before(() => {
    // _controller = Controller.init({ view: new View() });
  });
  it('should update table if data is valid', async (context) => {
    const document = getDocument(context.mock);
    const view = new View();

    const addRow = context.mock.method(view, view.addRow.name);

    _controller = await Controller.init({
      view,
      service: {
        createUser: context.mock.fn(async () => ({})),
        getUsers: context.mock.fn(async () => []),
      },
    });

    const [name, age, email, tableBody, form, btnFormClear] =
      document.querySelector.mock.calls;

    assert.strictEqual(name.arguments[0], '#name');
    assert.strictEqual(age.arguments[0], '#age');
    assert.strictEqual(email.arguments[0], '#email');
    assert.strictEqual(tableBody.arguments[0], '.flex-table');
    assert.strictEqual(form.arguments[0], '#form');
    assert.strictEqual(btnFormClear.arguments[0], '#btnFormClear');

    const listenerCallback =
      form.result.addEventListener.mock.calls[0].arguments[1];
    const preventDefaultSpy = context.mock.fn();

    assert.strictEqual(addRow.mock.callCount(), 3);

    listenerCallback({ preventDefault: preventDefaultSpy });

    assert.strictEqual(addRow.mock.callCount(), 4);

    assert.deepStrictEqual(addRow.mock.calls.at(3).arguments.at(0), {
      name: 'test',
      age: 'test',
      email: 'test',
    });
  });

  it('should notify if form is invalid', async (context) => {
    const document = getDocument(context.mock, {
      name: '',
      age: '12',
      email: 'e@e.com',
    });
    context.mock.method(document, 'querySelector', (...args) => {
      return {
        value: '',
        appendChild: context.mock.fn(() => {}),
        reset: context.mock.fn(() => {}),
        addEventListener: context.mock.fn((event, fn) => {}),
      };
    });
    const view = new View();

    const addRow = context.mock.method(view, view.addRow.name);
    const notify = context.mock.method(view, view.notify.name);

    _controller = await Controller.init({
      view,
      service: {
        createUser: context.mock.fn(async () => ({})),
        getUsers: context.mock.fn(async () => []),
      },
    });

    const [name, age, email, tableBody, form, btnFormClear] =
      document.querySelector.mock.calls;

    const listenerCallback =
      form.result.addEventListener.mock.calls[0].arguments[1];
    const preventDefaultSpy = context.mock.fn();

    assert.strictEqual(addRow.mock.callCount(), 3);

    listenerCallback({ preventDefault: preventDefaultSpy });

    assert.strictEqual(addRow.mock.callCount(), 3);
    assert.strictEqual(notify.mock.callCount(), 1);
    assert.strictEqual(
      notify.mock.calls.at(0).arguments.at(0).msg,
      'Invalid data'
    );

    // assert.deepStrictEqual(addRow.mock.calls.at(3).arguments.at(0), {
    //   name: 'test',
    //   age: 'test',
    //   email: 'test',
    // });
  });
});
