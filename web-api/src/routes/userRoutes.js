import { DEFAULT_HEADERS } from '../util/util.js';
import { once } from 'node:events';

const routes = ({ userService }) => ({
  '/users:get': async (req, res) => {
    const users = await userService.find();
    res.writeHead(200, DEFAULT_HEADERS);
    res.end(JSON.stringify(users));
  },
  '/users:post': async (req, res) => {
    const dataBuffer = await once(req, 'data');
    const data = JSON.parse(dataBuffer);
    await userService.create(data);
    res.writeHead(201, DEFAULT_HEADERS);
    res.end(
      JSON.stringify({ result: `user: ${data.name} created successfully` })
    );
  },
});

export { routes };
