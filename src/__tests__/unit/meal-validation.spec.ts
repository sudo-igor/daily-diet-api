import {z} from 'zod';

// Esquema de validação semelhante ao usado na rota de refeições
const createMealBodySchema = z.object({
  name: z.string().nonempty('Nome da refeição é obrigatório'),
  description: z.string().nonempty('Descrição é obrigatória'),
  date: z.coerce.date(),
  time: z.string().nonempty('Horário é obrigatório'),
  onDiet: z.boolean(),
  calories: z.number().int().positive().optional(),
});

describe('Validação de Refeição', () => {
  test('Deve validar dados de refeição corretos', () => {
    const mealData = {
      name: 'Café da Manhã',
      description: 'Café com pão integral',
      date: '2023-10-15',
      time: '08:30',
      onDiet: true,
      calories: 350,
    };

    const result = createMealBodySchema.safeParse(mealData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe(mealData.name);
      expect(result.data.description).toBe(mealData.description);
      expect(result.data.date instanceof Date).toBe(true);
      expect(result.data.time).toBe(mealData.time);
      expect(result.data.onDiet).toBe(mealData.onDiet);
      expect(result.data.calories).toBe(mealData.calories);
    }
  });

  test('Deve rejeitar nome vazio', () => {
    const mealData = {
      name: '',
      description: 'Café com pão integral',
      date: '2023-10-15',
      time: '08:30',
      onDiet: true,
      calories: 350,
    };

    const result = createMealBodySchema.safeParse(mealData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        'Nome da refeição é obrigatório',
      );
    }
  });

  test('Deve rejeitar descrição vazia', () => {
    const mealData = {
      name: 'Café da Manhã',
      description: '',
      date: '2023-10-15',
      time: '08:30',
      onDiet: true,
      calories: 350,
    };

    const result = createMealBodySchema.safeParse(mealData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Descrição é obrigatória');
    }
  });

  test('Deve rejeitar data inválida', () => {
    const mealData = {
      name: 'Café da Manhã',
      description: 'Café com pão integral',
      date: 'data-invalida',
      time: '08:30',
      onDiet: true,
      calories: 350,
    };

    const result = createMealBodySchema.safeParse(mealData);
    expect(result.success).toBe(false);
  });

  test('Deve rejeitar calorias negativas', () => {
    const mealData = {
      name: 'Café da Manhã',
      description: 'Café com pão integral',
      date: '2023-10-15',
      time: '08:30',
      onDiet: true,
      calories: -100,
    };

    const result = createMealBodySchema.safeParse(mealData);
    expect(result.success).toBe(false);
  });
});
