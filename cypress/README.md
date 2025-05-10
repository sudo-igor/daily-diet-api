# Testes de API com Cypress

Este diretório contém testes E2E para a API Daily Diet usando Cypress.

## Estrutura

- `e2e/api/`: Contém os testes da API
  - `users.cy.js`: Testes dos endpoints de usuários
  - `meals.cy.js`: Testes dos endpoints de refeições
- `support/`: Arquivos de suporte
  - `e2e.js`: Configurações e comandos personalizados

## Como executar os testes

Antes de executar os testes, certifique-se de que a API está em execução em `http://localhost:3333`.

### Interface gráfica do Cypress

```bash
yarn cy:open
```

### Linha de comando

```bash
yarn cy:run
```

## Comandos personalizados

- `cy.login(email, password)`: Faz login com as credenciais fornecidas
- `cy.createUser(userData)`: Cria um novo usuário
- `cy.createMeal(mealData, sessionId)`: Cria uma nova refeição

## Endpoints testados

### Usuários

- `POST /v1/users`: Criar um usuário
- `POST /v1/users/login`: Fazer login
- `GET /v1/users`: Obter o perfil do usuário atual
- `GET /v1/users/listAllUsers`: Listar todos os usuários

### Refeições

- `POST /v1/meals`: Criar uma refeição
- `GET /v1/meals`: Listar refeições do usuário
- `GET /v1/meals/:id`: Obter uma refeição específica
- `PUT /v1/meals/:id`: Atualizar uma refeição
- `DELETE /v1/meals/:id`: Excluir uma refeição
- `GET /v1/meals/metrics`: Obter métricas das refeições 