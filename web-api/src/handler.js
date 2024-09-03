import { fileURLToPath, parse } from 'node:url';
import { routes } from './routes/userRoutes.js';
import { DEFAULT_HEADERS } from './util/util.js';
import { generateUserInstance } from './factory/userFactory.js';
import { dirname, join } from 'node:path';

// import data from '../database/data.json' assert { type: 'json' };

const currentPath = dirname(fileURLToPath(import.meta.url));
const filePath = join(currentPath, '..', 'database', 'data.json');
const userService = generateUserInstance({ filePath });

const userRoutes = routes({ userService });
const allRoutes = {
  ...userRoutes,
  default(request, response) {
    response.writeHead(404, DEFAULT_HEADERS);
    response.write(
      JSON.stringify({
        error: 'Not Found',
        message: `Cannot ${request.method} ${request.url}`,
      })
    );
    response.end();
  },
};

export default function handler(request, response) {
  const { method, url } = request;
  const { pathname } = parse(url, true);

  const key = `${pathname}:${method.toLowerCase()}`;
  const chosen = allRoutes[key] ?? allRoutes.default;
  return Promise.resolve(chosen(request, response)).catch((error) => {
    console.error(error);
  });
}
