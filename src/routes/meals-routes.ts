import {z} from 'zod';
import {randomUUID} from 'node:crypto';
import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';

import {knex} from '../database';
import {checkSessionIdSession} from '../middlewares/check-session-id-exists';

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdSession],
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const createMealBodySchema = z.object({
        name: z.string().nonempty('Nome da refeição é obrigatório'),
        description: z.string().nonempty('Descrição é obrigatória'),
        date: z.coerce.date(),
        time: z.string().nonempty('Horário é obrigatório'),
        onDiet: z.boolean(),
        calories: z.number().int().positive().optional(),
      });

      const validationResult = createMealBodySchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).send({
          message: validationResult.error.errors,
        });
      }

      const {name, description, date, time, onDiet, calories} =
        validationResult.data;

      const {sessionId} = req.cookies;

      const user = await knex('users')
        .select('id')
        .where({session_id: sessionId})
        .first();

      if (!user) {
        return res.status(401).send({
          message: 'Usuário não encontrado',
        });
      }

      const meal = await knex('meals')
        .insert({
          id: randomUUID(),
          name,
          description,
          date: date.toISOString(),
          time,
          on_diet: onDiet,
          calories,
          user_id: user.id,
        })
        .returning('*');

      res.status(201).send({meal});
    },
  );

  app.get(
    '/',
    {
      preHandler: [checkSessionIdSession],
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const {sessionId} = req.cookies;

      const user = await knex('users')
        .select('id')
        .where({session_id: sessionId})
        .first();

      if (!user) {
        return res.status(401).send({
          message: 'Usuário não encontrado',
        });
      }

      const meals = await knex('meals')
        .where({user_id: user.id})
        .orderBy('date', 'desc')
        .orderBy('time', 'desc');

      res.send({meals});
    },
  );

  app.get(
    '/metrics',
    {
      preHandler: [checkSessionIdSession],
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const {sessionId} = req.cookies;

      const user = await knex('users')
        .select('id')
        .where({session_id: sessionId})
        .first();

      if (!user) {
        return res.status(401).send({
          message: 'Usuário não encontrado',
        });
      }

      const meals = await knex('meals')
        .select('on_diet')
        .where({user_id: user.id})
        .orderBy('date', 'desc')
        .orderBy('time', 'desc');

      let bestSequence = 0;
      let currentSequence = 0;

      for (const meal of meals) {
        if (meal.on_diet) {
          currentSequence++;
          bestSequence = Math.max(bestSequence, currentSequence);
        } else {
          currentSequence = 0;
        }
      }

      const onDiet = meals.filter((meal) => meal.on_diet).length;

      res.send({
        total: meals.length,
        onDiet,
        offDiet: meals.length - onDiet,
        bestSequence,
      });
    },
  );

  app.get(
    '/metrics/daily',
    {
      preHandler: [checkSessionIdSession],
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const {sessionId} = req.cookies;

      const user = await knex('users')
        .select('id')
        .where({session_id: sessionId})
        .first();

      if (!user) {
        return res.status(401).send({
          message: 'Usuário não encontrado',
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const meals = await knex('meals')
        .select('*')
        .where({user_id: user.id})
        .where('date', '>=', today.toISOString())
        .orderBy('time', 'desc');

      const onDiet = meals.filter((meal) => meal.on_diet).length;
      const totalCalories = meals.reduce(
        (acc, meal) => acc + (meal.calories || 0),
        0,
      );

      res.send({
        total: meals.length,
        onDiet,
        offDiet: meals.length - onDiet,
        totalCalories,
        meals,
      });
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdSession],
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const getMealParams = z.object({
        id: z.string().uuid('ID inválido'),
      });

      const paramsResult = getMealParams.safeParse(req.params);

      if (!paramsResult.success) {
        return res.status(400).send({
          message: paramsResult.error.errors,
        });
      }

      const {id} = paramsResult.data;
      const {sessionId} = req.cookies;

      const user = await knex('users')
        .select('id')
        .where({session_id: sessionId})
        .first();

      if (!user) {
        return res.status(401).send({
          message: 'Usuário não encontrado',
        });
      }

      const meal = await knex('meals').where({id, user_id: user.id}).first();

      if (!meal) {
        return res.status(404).send({
          message: 'Refeição não encontrada',
        });
      }

      res.send({meal});
    },
  );

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdSession],
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const editMealParams = z.object({
        id: z.string().uuid('ID inválido'),
      });

      const editMealBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        date: z.coerce.date().optional(),
        time: z.string().optional(),
        onDiet: z.boolean().optional(),
        calories: z.number().int().positive().optional(),
      });

      const paramsResult = editMealParams.safeParse(req.params);
      const bodyResult = editMealBodySchema.safeParse(req.body);

      if (!paramsResult.success) {
        return res.status(400).send({
          message: paramsResult.error.errors,
        });
      }

      if (!bodyResult.success) {
        return res.status(400).send({
          message: bodyResult.error.errors,
        });
      }

      const {id} = paramsResult.data;
      const {name, description, date, time, onDiet, calories} = bodyResult.data;

      const {sessionId} = req.cookies;

      const user = await knex('users')
        .select('id')
        .where({session_id: sessionId})
        .first();

      if (!user) {
        return res.status(401).send({
          message: 'Usuário não encontrado',
        });
      }

      const meal = await knex('meals').where({id, user_id: user.id}).first();

      if (!meal) {
        return res.status(404).send({
          message: 'Refeição não encontrada',
        });
      }

      const updatedMeal = await knex('meals')
        .where({id})
        .update({
          name,
          description,
          date: date?.toISOString(),
          time,
          on_diet: onDiet,
          calories,
          updated_at: new Date(),
        })
        .returning('*');

      res.status(200).send({meal: updatedMeal});
    },
  );

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdSession],
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const deleteMealParams = z.object({
        id: z.string().uuid('ID inválido'),
      });

      const paramsResult = deleteMealParams.safeParse(req.params);

      if (!paramsResult.success) {
        return res.status(400).send({
          message: paramsResult.error.errors,
        });
      }

      const {id} = paramsResult.data;
      const {sessionId} = req.cookies;

      const user = await knex('users')
        .select('id')
        .where({session_id: sessionId})
        .first();

      if (!user) {
        return res.status(401).send({
          message: 'Usuário não encontrado',
        });
      }

      const meal = await knex('meals').where({id, user_id: user.id}).first();

      if (!meal) {
        return res.status(404).send({
          message: 'Refeição não encontrada',
        });
      }

      await knex('meals').where({id}).delete();

      res.status(204).send();
    },
  );
}
