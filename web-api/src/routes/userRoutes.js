import { DEFAULT_HEADERS } from '../util/util.js';

const routes = ({ userService }) => ({
  '/users:get': async (req, res) => {
    const users = await userService.find();
    res.writeHead(200, DEFAULT_HEADERS);
    res.end(JSON.stringify(users));
  },
  '/users:post': async (req, res) => {
    res.writeHead(201, DEFAULT_HEADERS);
    res.end('post');
  },
});

export { routes };
