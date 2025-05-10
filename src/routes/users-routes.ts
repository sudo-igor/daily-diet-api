import {z} from 'zod';
import {randomUUID} from 'node:crypto';
import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import bcrypt from 'bcrypt';

import {knex} from '../database';
import {checkSessionIdSession} from '../middlewares/check-session-id-exists';

export async function usersRoutes(app: FastifyInstance) {
  // Endpoint público para listar todos os usuários
  app.get('/listAllUsers', async (req, reply) => {
    try {
      const allUsers = await knex('users').select('*');
      return reply.send({
        total: allUsers.length,
        users: allUsers,
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return reply.status(500).send({error: 'Erro ao listar usuários'});
    }
  });

  app.post('/', async (req: FastifyRequest, res: FastifyReply) => {
    const createUserBodySchema = z.object({
      email: z.string().email('Email inválido'),
      password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
      firstName: z.string().nonempty('Nome não pode estar vazio'),
      lastName: z.string().nonempty('Sobrenome não pode estar vazio'),
      photoUrl: z.string().url().optional(),
      weight: z.number().optional(),
      height: z.number().optional(),
      goal: z.enum(['Perder peso', 'Manter o peso', 'Ganhar peso']).optional(),
    });

    const validationResult = createUserBodySchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).send({
        message: validationResult.error.errors,
      });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      photoUrl,
      weight,
      height,
      goal,
    } = validationResult.data;

    // Verifica se o email já está em uso
    const existingUser = await knex('users').where({email}).first();

    if (existingUser) {
      return res.status(400).send({
        message: 'Email já está em uso',
      });
    }

    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await knex('users').insert(
      {
        id: randomUUID(),
        email,
        password: hashedPassword,
        last_name: lastName,
        photo_url: photoUrl,
        session_id: sessionId,
        first_name: firstName,
        weight,
        height,
        goal,
      },
      '*',
    );

    res.send({user});
  });

  app.post('/login', async (req: FastifyRequest, res: FastifyReply) => {
    const loginSchema = z.object({
      email: z.string().email('Email inválido'),
      password: z.string().min(6, 'Senha inválida'),
    });

    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).send({
        message: validationResult.error.errors,
      });
    }

    const {email, password} = validationResult.data;

    const user = await knex('users').where({email}).first();

    if (!user) {
      return res.status(401).send({
        message: 'Email ou senha inválidos',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({
        message: 'Email ou senha inválidos',
      });
    }

    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    await knex('users').where({id: user.id}).update({session_id: sessionId});

    res.send({user});
  });

  app.get(
    '/',
    {preHandler: [checkSessionIdSession]},
    async (req: FastifyRequest, res: FastifyReply) => {
      const {sessionId} = req.cookies;

      const user = await knex('users')
        .where({session_id: sessionId})
        .select(
          'id',
          'first_name',
          'last_name',
          'email',
          'photo_url',
          'weight',
          'height',
          'goal',
        )
        .first();

      if (!user) {
        return res.status(401).send({
          message: 'Usuário não encontrado',
        });
      }

      res.send({user});
    },
  );

  app.put(
    '/profile',
    {preHandler: [checkSessionIdSession]},
    async (req: FastifyRequest, res: FastifyReply) => {
      const updateProfileSchema = z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        photoUrl: z.string().url().optional(),
        weight: z.number().optional(),
        height: z.number().optional(),
        goal: z
          .enum(['Perder peso', 'Manter o peso', 'Ganhar peso'])
          .optional(),
      });

      const validationResult = updateProfileSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).send({
          message: validationResult.error.errors,
        });
      }

      const {sessionId} = req.cookies;

      // Verificar se o usuário existe
      const existingUser = await knex('users')
        .where({session_id: sessionId})
        .first();

      if (!existingUser) {
        return res.status(401).send({
          message: 'Usuário não encontrado',
        });
      }

      const {firstName, lastName, photoUrl, weight, height, goal} =
        validationResult.data;

      const user = await knex('users')
        .where({session_id: sessionId})
        .update({
          first_name: firstName,
          last_name: lastName,
          photo_url: photoUrl,
          weight,
          height,
          goal,
          updated_at: new Date(),
        })
        .returning('*');

      res.send({user});
    },
  );

  app.delete(
    '/',
    {preHandler: [checkSessionIdSession]},
    async (req: FastifyRequest, res: FastifyReply) => {
      const {sessionId} = req.cookies;

      await knex('users').where({session_id: sessionId}).delete();

      res.clearCookie('sessionId', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      res.status(204).send();
    },
  );

  app.post('/logout', async (req: FastifyRequest, res: FastifyReply) => {
    const {sessionId} = req.cookies;

    if (sessionId) {
      // Atualizar o sessionId no banco para null
      await knex('users')
        .where({session_id: sessionId})
        .update({session_id: null});

      // Limpar o cookie de sessão
      res.clearCookie('sessionId', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    return res.status(200).send({message: 'Logout realizado com sucesso'});
  });
}
