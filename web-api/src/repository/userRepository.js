import { readFile } from 'node:fs/promises';

export default class UserRepository {
  #file;
  constructor({ file }) {
    this.#file = file;
  }

  async find() {
    return readFile(this.#file).then((data) => JSON.parse(data));
  }
}
