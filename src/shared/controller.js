/**
 * @typedef {import('./viewBase').default} View
 */
export default class Controller {
  /** @type {View} */
  #view;

  /** @param {{view: View}} deps */
  constructor({ view }) {
    this.#view = view;
  }

  static init(deps) {
    const controller = new Controller(deps);
    controller.#init();
    return controller;
  }

  #isValid({ name, age, email }) {
    return name && age && email;
  }

  #onSubmit({ name, age, email }) {
    if (!this.#isValid({ name, age, email })) {
      this.#view.notify({ msg: "Invalid data", isError: true });
      return;
    }
    this.#view.addRow({ name, age, email });
  }

  #init() {
    this.#view.configureFormSubmit(this.#onSubmit.bind(this));
    this.#view.configureFormClear();
    const initialData = [
      { name: "Alice", age: 34, email: "a@mm.com" },
      { name: "Bob", age: 24, email: "ss@d.com" },
      { name: "Charlie", age: 45, email: "dscf@sd.com" },
    ];
    this.#view.render(initialData);
  }
}
