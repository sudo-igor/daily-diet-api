# Daily Diet API

## Projeto para a matéria de Teste de Software da Universidade Católica de Brasília

Link para o repositório original: https://github.com/MrRioja/daily-diet-api

# TL;DR: Daily Diet

## Instalação Rápida

```bash
# Na raiz do projeto, instale as dependências principais
yarn install

# Instale as dependências da API
cd daily-diet-api
yarn install

# Instale as dependências do frontend
cd ../daily-diet-web
yarn install
```

## Configuração Pós-Instalação

Após instalar as dependências, você precisa configurar o banco de dados da API:

```bash
# Na pasta da API
cd daily-diet-api

# Crie a pasta db se não existir
mkdir -p db

# Execute as migrações para criar o esquema do banco de dados
yarn knex migrate:latest
```

## Executar o Projeto

```bash
# Na raiz do projeto, inicia API e frontend ao mesmo tempo
yarn dev

# Para iniciar apenas a API
yarn dev:api

# Para iniciar apenas o frontend
yarn dev:web
```

## Executar os Testes

```bash
# Na raiz, executa TODOS os testes (limpa relatórios, roda testes unitários e E2E)
yarn test

# Alternativa usando Node diretamente (mais compatível com Windows)
node run-tests.js

# Executa apenas testes do frontend
yarn test:web

# Executa apenas testes da API
yarn test:api

# Executa apenas testes unitários (sem Cypress)
yarn test:unit
```

## Estrutura de Testes

- Frontend: testes unitários (Jest) + testes E2E (Cypress)
- API: testes unitários (Jest) + testes de API (Cypress)

## Resultados dos Testes

Os relatórios de testes são gerados em:
- `daily-diet-web/cypress/reports/` (HTML e JSON)
- `daily-diet-api/cypress/reports/` (HTML e JSON)

Os vídeos de execução dos testes são gerados em:
- `daily-diet-web/cypress/videos/` (formato MP4)
- `daily-diet-api/cypress/videos/` (formato MP4)

Screenshots (em caso de falhas) são gerados em:
- `daily-diet-web/cypress/screenshots/`
- `daily-diet-api/cypress/screenshots/`

## Limpeza de Relatórios

Para limpar todos os relatórios, vídeos e screenshots (recomendado antes de executar novos testes):

```bash
# A maneira mais simples (a partir da raiz)
yarn clean

# Limpar relatórios apenas do frontend
cd daily-diet-web
yarn report:clean

# Limpar relatórios apenas da API
cd daily-diet-api
yarn report:clean
```

Nota: O comando `yarn test` já inclui a limpeza automática de relatórios antes da execução dos testes.


## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
