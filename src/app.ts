import {fastify} from 'fastify';
import cookie from '@fastify/cookie';

import {mealsRoutes} from './routes/meals-routes';
import {usersRoutes} from './routes/users-routes';
import {mealModificationsRoutes} from './routes/meal-modifications-routes';

export const app = fastify();

const FRONTEND_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://seu-dominio.com'
    : 'http://localhost:5173';

// Registrar o plugin de cookie antes de configurar o CORS
app.register(cookie);

// Configuração do CORS
app.addHook('onRequest', (request, reply, done) => {
  // Permitir requisições de qualquer origem em desenvolvimento
  const origin = request.headers.origin || '*';

  reply.header('Access-Control-Allow-Origin', origin);
  reply.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  reply.header('Access-Control-Allow-Headers', 'Content-Type');
  reply.header('Access-Control-Allow-Credentials', 'true');
  done();
});

// Handler para requisições OPTIONS (preflight)
app.options('*', (request, reply) => {
  const origin = request.headers.origin || '*';

  reply.header('Access-Control-Allow-Origin', origin);
  reply.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  reply.header('Access-Control-Allow-Headers', 'Content-Type');
  reply.header('Access-Control-Allow-Credentials', 'true');
  reply.send();
});

app.register(mealsRoutes, {
  prefix: '/v1/meals',
});

app.register(usersRoutes, {
  prefix: '/v1/users',
});

app.register(mealModificationsRoutes, {
  prefix: '/v1/meal-modifications',
});
