export default class Service {
  #url;
  constructor({ url }) {
    this.#url = url;
  }

  async getUsers() {
    const result = await fetch(`${this.#url}/users`);
    return result.json();
  }

  async createUser(data) {
    const result = await fetch(`${this.#url}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return result.json();
  }
}
