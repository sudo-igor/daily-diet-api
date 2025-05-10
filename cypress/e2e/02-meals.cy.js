/// <reference types="cypress" />

describe('02. API de Refeições', () => {
  let sessionId = null;
  let mealId = null;
  let testUser = null;

  // Configurar um usuário de teste e obter um sessionId válido
  before(() => {
    testUser = {
      email: `test_meal_${Date.now()}@example.com`,
      password: '123456',
      firstName: 'Test',
      lastName: 'User',
    };

    // Criar um usuário de teste
    cy.request({
      method: 'POST',
      url: '/v1/users',
      body: testUser,
    }).then((response) => {
      expect(response.status).to.eq(200);

      // Fazer login com o usuário criado
      cy.request({
        method: 'POST',
        url: '/v1/users/login',
        body: {
          email: testUser.email,
          password: testUser.password,
        },
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);

        // Extrair o sessionId do cookie
        const cookies = loginResponse.headers['set-cookie'];
        if (cookies) {
          const sessionCookie = cookies.find((cookie) =>
            cookie.includes('sessionId='),
          );
          if (sessionCookie) {
            sessionId = sessionCookie.split('=')[1].split(';')[0];
            cy.log(`Sessão obtida: ${sessionId}`);
          }
        }
      });
    });
  });

  beforeEach(() => {
    // Garantir que temos uma sessão válida antes de cada teste
    if (sessionId) {
      cy.log(`Usando sessão: ${sessionId}`);
    } else {
      cy.log('Sessão não encontrada, fazendo login novamente');
      cy.request({
        method: 'POST',
        url: '/v1/users/login',
        body: {
          email: testUser.email,
          password: testUser.password,
        },
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);

        // Extrair o sessionId do cookie
        const cookies = loginResponse.headers['set-cookie'];
        if (cookies) {
          const sessionCookie = cookies.find((cookie) =>
            cookie.includes('sessionId='),
          );
          if (sessionCookie) {
            sessionId = sessionCookie.split('=')[1].split(';')[0];
            cy.log(`Nova sessão obtida: ${sessionId}`);
          }
        }
      });
    }
  });

  it('M01: Deve criar uma nova refeição', () => {
    const meal = {
      name: 'Teste de Refeição',
      description: 'Descrição do teste de refeição',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      onDiet: true,
      calories: 500,
    };

    cy.request({
      method: 'POST',
      url: '/v1/meals',
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
      body: meal,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('meal');
      expect(response.body.meal[0]).to.have.property('id');

      // Salvar o ID da refeição para uso nos outros testes
      mealId = response.body.meal[0].id;
      cy.log(`Refeição criada com ID: ${mealId}`);
    });
  });

  it('M02: Deve listar as refeições do usuário', () => {
    cy.request({
      method: 'GET',
      url: '/v1/meals',
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('meals');
      expect(response.body.meals).to.be.an('array');
      expect(response.body.meals.length).to.be.at.least(1);
    });
  });

  it('M03: Deve obter uma refeição específica', () => {
    // Verificar se temos um ID de refeição válido
    expect(mealId).to.not.be.null;
    cy.log(`Buscando refeição com ID: ${mealId}`);

    cy.request({
      method: 'GET',
      url: `/v1/meals/${mealId}`,
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('meal');
      expect(response.body.meal).to.have.property('id', mealId);
    });
  });

  it('M04: Deve editar uma refeição', () => {
    // Verificar se temos um ID de refeição válido
    expect(mealId).to.not.be.null;
    cy.log(`Editando refeição com ID: ${mealId}`);

    const updatedMeal = {
      name: 'Refeição Atualizada',
      description: 'Descrição atualizada',
      onDiet: false,
    };

    cy.request({
      method: 'PUT',
      url: `/v1/meals/${mealId}`,
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
      body: updatedMeal,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('meal');
      expect(response.body.meal[0]).to.have.property('name', updatedMeal.name);
      expect(response.body.meal[0]).to.have.property(
        'description',
        updatedMeal.description,
      );

      // Verificar se on_diet é 0 (falso) ou false
      const onDietValue = response.body.meal[0].on_diet;
      expect(
        onDietValue === false || onDietValue === 0,
        `on_diet deveria ser false ou 0, mas foi ${onDietValue}`,
      ).to.be.true;
    });
  });

  it('M05: Deve obter as métricas das refeições', () => {
    cy.request({
      method: 'GET',
      url: '/v1/meals/metrics',
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('total');
      expect(response.body).to.have.property('onDiet');
      expect(response.body).to.have.property('offDiet');
      expect(response.body).to.have.property('bestSequence');
    });
  });

  it('M06: Deve excluir uma refeição', () => {
    // Verificar se temos um ID de refeição válido
    expect(mealId).to.not.be.null;
    cy.log(`Excluindo refeição com ID: ${mealId}`);

    cy.request({
      method: 'DELETE',
      url: `/v1/meals/${mealId}`,
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(204);

      // Verificar se a refeição foi realmente excluída
      cy.request({
        method: 'GET',
        url: `/v1/meals/${mealId}`,
        headers: {
          Cookie: `sessionId=${sessionId}`,
        },
        failOnStatusCode: false,
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(404);
      });
    });
  });
});
