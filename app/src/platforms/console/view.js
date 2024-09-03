import ViewBase from '../../shared/viewBase.js';
import LayoutBuilder from './layoutBuilder.js';

export default class View extends ViewBase {
  #layoutBuilder;
  #components;
  #data = [];
  #headers = [];
  #onFormSubmit = () => {};
  #onFormClear = () => {};

  constructor(layoutBuilder = new LayoutBuilder()) {
    super();
    this.#layoutBuilder = layoutBuilder;
  }
  #prepareData(items) {
    if (!items)
      return {
        headers: this.#headers,
        data: [],
      };
    this.#headers = Object.keys(items[0]);
    return {
      headers: this.#headers,
      data: items.map((item) => Object.values(item).map(String)),
    };
  }
  addRow(data) {
    this.#data.push(data);
    const items = this.#prepareData(this.#data);
    this.#components.table.setData(items);
    this.#components.screen.render();
  }
  notify({ msg, isError }) {
    this.#components?.alert.setMessage(msg);
  }
  configureFormSubmit(fn) {
    this.#onFormSubmit = (data) => fn(data);
  }
  resetForm() {
    this.#components.form.reset();
    this.#components.screen.render();
  }
  configureFormClear(fn) {
    this.#onFormClear = () => {
      this.resetForm();
      fn();
    };
  }

  #initializeComponentsFacade() {
    this.#components = this.#layoutBuilder
      .setScreen({ title: 'Fullstack vanilla JS' })
      .setLayout()
      .setFormComponent({
        onSubmit: this.#onFormSubmit, //bc it's arrow function, no need to bind "this"
        onClear: this.#onFormClear,
      })
      .setAlertComponent()
      .setTableComponent({ numColumns: 3 })
      .build();
  }

  render(items) {
    this.#initializeComponentsFacade();
    items.forEach((item) => this.addRow(item));
  }
}
