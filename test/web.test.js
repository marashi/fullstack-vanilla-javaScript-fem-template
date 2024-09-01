import { describe, it, before } from "node:test";
import Controller from "../src/shared/controller.js";
import View from "../src/platforms/web/view.js";

globalThis.window = {};

function getDocument(mock) {
  globalThis.alert = mock.fn(() => {});
  globalThis.document = {
    querySelector: mock.fn((id) => ({
      appendChild: mock.fn(() => {}),
      reset: mock.fn(() => {}),
      addEventListener: mock.fn((event, fn) => {
        return fn({
          preventDefault: mock.fn(() => {}),
        });
      }),
    })),
    createElement: mock.fn((name) => ({
      classList: {
        add: mock.fn(() => {}),
      },
    })),
    addEventListener: mock.fn((event, fn) => {
      return fn({
        preventDefault: mock.fn(() => {}),
      });
    }),
  };

  return globalThis.document;
}

describe("Web app test suite", () => {
  let _controller;
  before(() => {
    // _controller = Controller.init({ view: new View() });
  });
  it("should be able to run tests", (context) => {
    const document = getDocument(context.mock);
    _controller = Controller.init({ view: new View() });

    console.log("Running tests for web app");
  });
});
