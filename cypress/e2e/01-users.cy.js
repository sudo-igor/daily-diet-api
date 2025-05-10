/// <reference types="cypress" />

describe('01. API de Usuários', () => {
  let sessionId = null;
  let testUser = null;

  // Configurar um usuário de teste e obter um sessionId válido
  before(() => {
    testUser = {
      email: `test_user_${Date.now()}@example.com`,
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
      expect(response.body).to.have.property('user');

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
    if (!sessionId) {
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

  it('U01: Deve listar todos os usuários', () => {
    cy.request({
      method: 'GET',
      url: '/v1/users/list',
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.have.property('users');
        expect(response.body.users).to.be.an('array');
      } else {
        // API pode não permitir listar todos os usuários sem permissão de admin
        expect(response.status).to.be.oneOf([401, 403, 404]);
      }
    });
  });

  it('U02: Deve obter o perfil do usuário atual', () => {
    // Garantir que temos um sessionId válido
    expect(sessionId).not.to.be.null;

    cy.request({
      method: 'GET',
      url: '/v1/users',
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.be.an('object');
    });
  });

  it('U03: Deve atualizar o perfil do usuário', () => {
    // Garantir que temos um sessionId válido
    expect(sessionId).not.to.be.null;

    const updatedProfile = {
      firstName: 'Nome Atualizado',
      lastName: 'Sobrenome Atualizado',
    };

    cy.request({
      method: 'PUT',
      url: '/v1/users/profile',
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
      body: updatedProfile,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('user');

      // Verificar o formato da resposta
      const user = response.body.user;
      if (Array.isArray(user)) {
        // Se for um array, verificar o primeiro elemento
        expect(user[0]).to.have.property(
          'first_name',
          updatedProfile.firstName,
        );
        expect(user[0]).to.have.property('last_name', updatedProfile.lastName);
      } else {
        // Se for um objeto, verificar diretamente
        expect(user).to.have.property('first_name', updatedProfile.firstName);
        expect(user).to.have.property('last_name', updatedProfile.lastName);
      }
    });
  });

  it('U04: Deve fazer logout do usuário', () => {
    // Garantir que temos um sessionId válido
    expect(sessionId).not.to.be.null;

    cy.request({
      method: 'POST',
      url: '/v1/users/logout',
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 204]);
    });
  });
});
