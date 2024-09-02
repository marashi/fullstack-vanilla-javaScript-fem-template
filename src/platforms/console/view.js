import ViewBase from '../../shared/viewBase.js';
import LayoutBuilder from './layoutBuilder.js';

export default class View extends ViewBase {
  #layoutBuilder;
  #components;
  #onFormSubmit = () => {};
  #onFormClear = () => {};

  constructor(layoutBuilder = new LayoutBuilder()) {
    super();
    this.#layoutBuilder = layoutBuilder;
  }
  notify({ msg, isError }) {
    this.#components.alert.setMessage(msg);
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
      .build();
  }

  render(items) {
    this.#initializeComponentsFacade();
  }
}
