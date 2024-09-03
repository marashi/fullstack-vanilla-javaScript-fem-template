/**
 * @typedef {import('./viewBase').default} View
 * @typedef {import('./service').default} Service
 */
export default class Controller {
  /** @type {View} */
  #view;
  /** @type {Service} */
  #service;

  /** @param {{view: View}} deps */
  constructor({ view, service }) {
    this.#view = view;
    this.#service = service;
  }

  static async init(deps) {
    const controller = new Controller(deps);
    await controller.#init();
    return controller;
  }

  #isValid({ name, age, email }) {
    return name && age && email;
  }

  #onSubmit({ name, age, email }) {
    if (!this.#isValid({ name, age, email })) {
      this.#view.notify({ msg: 'Invalid data', isError: true });
      return;
    }
    this.#view.addRow({ name, age, email });
    this.#view.resetForm();
  }

  #onClear() {}

  async #getUsersFromAPI() {
    try {
      return await this.#service.getUsers();
    } catch {
      this.#view.notify({ msg: 'Server is not available!' });
      return [];
    }
  }

  async #init() {
    this.#view.configureFormSubmit(this.#onSubmit.bind(this));
    this.#view.configureFormClear(this.#onClear.bind(this));
    const data = await this.#getUsersFromAPI();
    const initialData = [
      { name: 'Alice', age: 34, email: 'a@mm.com' },
      { name: 'Bob', age: 24, email: 'ss@d.com' },
      { name: 'Charlie', age: 45, email: 'dscf@sd.com' },
      ...data,
    ];
    this.#view.render(initialData);
  }
}
