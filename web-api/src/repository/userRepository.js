import { readFile, writeFile } from 'node:fs/promises';

export default class UserRepository {
  #file;
  constructor({ file }) {
    this.#file = file;
  }

  #currentFileContent = async () => {
    return JSON.parse(await readFile(this.#file));
  };

  async find() {
    return this.#currentFileContent();
  }

  async create(data) {
    const currentData = await this.#currentFileContent();
    const newContent = JSON.stringify([...currentData, data]);
    return writeFile(this.#file, newContent);
  }
}
