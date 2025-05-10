import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { knex } from '../database';

export async function mealModificationsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const sessionId = request.cookies.sessionId;

    if (!sessionId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const user = await knex('users')
      .where('session_id', sessionId)
      .first();

    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const modifications = await knex('meal_modifications')
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(100);

    return { modifications };
  });

  app.post('/', async (request, reply) => {
    const sessionId = request.cookies.sessionId;

    if (!sessionId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const user = await knex('users')
      .where('session_id', sessionId)
      .first();

    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const createModificationSchema = z.object({
      mealId: z.string().uuid(),
      type: z.enum(['create', 'update', 'delete']),
      mealData: z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string(),
        date: z.string(),
        time: z.string(),
        onDiet: z.boolean(),
        calories: z.number().optional(),
      }),
    });

    const { mealId, type, mealData } = createModificationSchema.parse(request.body);

    await knex('meal_modifications').insert({
      id: randomUUID(),
      user_id: user.id,
      meal_id: mealId,
      type,
      meal_data: mealData,
    });

    return reply.status(201).send();
  });
}
