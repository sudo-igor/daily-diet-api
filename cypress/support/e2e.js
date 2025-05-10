// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Remover a configuração de cookies antigas e substituir por session
// Cypress.Cookies.defaults({
//   preserve: 'sessionId',
// });

// Hook para preservar cookies entre testes
beforeEach(() => {
  // Preservar o cookie de sessão entre testes
  cy.session(
    'preserve-cookies',
    () => {
      // Sessão vazia apenas para preservar cookies
    },
    {
      validate: () => true,
      cacheAcrossSpecs: true,
    },
  );
});

// Adicionar comando personalizado para login
Cypress.Commands.add('login', (email, password) => {
  return cy
    .request({
      method: 'POST',
      url: '/v1/users/login',
      body: {
        email,
        password,
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      return response;
    });
});

// Adicionar comando personalizado para criar usuário
Cypress.Commands.add('createUser', (userData) => {
  return cy
    .request({
      method: 'POST',
      url: '/v1/users',
      body: userData,
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      return response;
    });
});

// Adicionar comando personalizado para criar refeição
Cypress.Commands.add('createMeal', (mealData, sessionId) => {
  return cy
    .request({
      method: 'POST',
      url: '/v1/meals',
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
      body: mealData,
    })
    .then((response) => {
      expect(response.status).to.eq(201);
      return response;
    });
});
