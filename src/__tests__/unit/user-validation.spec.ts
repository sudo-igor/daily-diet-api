import {z} from 'zod';

// Esquema de validação semelhante ao usado na rota de usuários
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

describe('Validação de Usuário', () => {
  test('Deve validar dados de usuário corretos', () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      photoUrl: 'https://example.com/photo.jpg',
      weight: 70,
      height: 175,
      goal: 'Manter o peso' as const,
    };

    const result = createUserBodySchema.safeParse(userData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(userData);
    }
  });

  test('Deve rejeitar email inválido', () => {
    const userData = {
      email: 'invalid-email',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const result = createUserBodySchema.safeParse(userData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Email inválido');
    }
  });

  test('Deve rejeitar senha muito curta', () => {
    const userData = {
      email: 'test@example.com',
      password: '12345', // Menos de 6 caracteres
      firstName: 'Test',
      lastName: 'User',
    };

    const result = createUserBodySchema.safeParse(userData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        'A senha deve ter no mínimo 6 caracteres',
      );
    }
  });

  test('Deve rejeitar nome vazio', () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: '',
      lastName: 'User',
    };

    const result = createUserBodySchema.safeParse(userData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Nome não pode estar vazio');
    }
  });

  test('Deve rejeitar valor inválido no campo goal', () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      goal: 'Objetivo inválido' as any,
    };

    const result = createUserBodySchema.safeParse(userData);
    expect(result.success).toBe(false);
  });
});
