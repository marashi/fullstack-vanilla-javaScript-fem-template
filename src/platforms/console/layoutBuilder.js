import blessed from 'blessed';
import contrib from 'blessed-contrib';

export default class LayoutBuilder {
  #screen;
  #layout;
  #form;
  #alert;
  #inputs = {};
  #buttons = {};

  setScreen({ title }) {
    this.#screen = blessed.screen({
      smartCSR: true,
      title,
    });
    this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

    return this;
  }

  setLayout() {
    this.#layout = blessed.layout({
      parent: this.#screen,
      width: '100%',
      height: '100%',
    });

    return this;
  }

  #createInputField({ parent, label, name, top }) {
    const input = blessed.textbox({
      parent,
      label,
      name,
      inputOnFocus: true,
      mouse: true,
      keys: true,
      vi: false,
      width: '60%',
      height: 3,
      top,
      left: 'center',
      border: {
        type: 'line',
      },
      style: {
        fg: 'white',
        bg: 'blue',
        focus: {
          bg: 'lightblue',
        },
      },
    });

    return input;
  }

  #createButton({ parent, name, content, bg, fg, left, bottom }) {
    const button = blessed.button({
      parent,
      name,
      content,
      mouse: true,
      keys: true,
      shrink: true,
      padding: {
        left: 1,
        right: 1,
      },
      left,
      bottom,
      width: 'shrink',
      style: {
        fg,
        bg,
        focus: {
          bg: `light${bg}`,
        },
        hover: {
          bg: `light${bg}`,
        },
      },
    });

    return button;
  }

  setFormComponent({ onSubmit, onClear }) {
    const form = blessed.form({
      parent: this.#layout,
      keys: true,
      vi: false,
      width: '100%',
      height: '40%',
      top: 0,
      left: 'center',
      label: 'User form',
      border: {
        type: 'line',
      },
      style: {
        fg: 'white',
        bg: 'black',
      },
    });

    const nameInput = this.#createInputField({
      parent: form,
      label: 'Name',
      name: 'name',
      top: 1,
    });

    const ageInput = this.#createInputField({
      parent: form,
      label: 'Age',
      name: 'age',
      top: 4,
    });

    const emailInput = this.#createInputField({
      parent: form,
      label: 'Email',
      name: 'email',
      top: 7,
    });

    const submitButton = this.#createButton({
      parent: form,
      name: 'submit',
      content: 'Submit',
      bg: 'green',
      fg: 'white',
      left: '45%',
      bottom: 1,
    });

    const clearButton = this.#createButton({
      parent: form,
      name: 'clear',
      content: 'Clear',
      bg: 'red',
      fg: 'white',
      left: '50%',
      bottom: 1,
    });

    submitButton.on('press', () => form.submit());

    clearButton.on('press', () => onClear());

    form.on('submit', (data) => {
      onSubmit(data);
    });

    this.#form = form;
    this.#inputs = { name: nameInput, age: ageInput, email: emailInput };
    this.#buttons = { submit: submitButton, clear: clearButton };
    nameInput.focus();
    return this;
  }

  setAlertComponent() {
    this.#alert = blessed.box({
      parent: this.#form,
      width: '40%',
      height: '20%',
      bottom: 0,
      border: {
        type: 'line',
      },
      style: {
        fg: 'white',
        bg: 'red',
      },
      content: '...',
      tags: true,
      align: 'center',
      hidden: true,
    });

    this.#alert.setMessage = (msg) => {
      this.#alert.setContent(`{bold}${msg}{/bold}`);
      this.#alert.show();
      this.#screen.render();

      setTimeout(() => {
        this.#alert.hide();
        this.#screen.render();
      }, 3000);
    };

    return this;
  }

  build() {
    const components = {
      screen: this.#screen,
      layout: this.#layout,
      form: this.#form,
      alert: this.#alert,
    };
    components.screen.render();
    return components;
  }
}
