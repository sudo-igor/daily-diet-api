# Daily Diet API

API RESTful para o aplicativo Daily Diet, um sistema de acompanhamento de dieta diária que permite aos usuários registrar suas refeições e acompanhar seu desempenho alimentar.

<p align="center">
  <img src="https://img.shields.io/static/v1?label=Daily&message=Diet&color=blueviolet&style=for-the-badge"/>
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/ldiasm/daily-diet-api?color=blueviolet&logo=TypeScript&logoColor=white&style=for-the-badge">
  <img alt="License" src="https://img.shields.io/github/license/ldiasm/daily-diet-api?color=blueviolet&logo=License&style=for-the-badge"/>
</p>

<p align="center">
  <a href="#sobre">Sobre</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#rotas">Rotas</a> •
  <a href="#requisitos">Requisitos</a> •
  <a href="#instalação">Instalação</a> •
  <a href="#banco-de-dados">Banco de Dados</a> •
  <a href="#desenvolvimento">Desenvolvimento</a> •
  <a href="#testando-a-api">Testando a API</a> •
  <a href="#solução-de-problemas">Solução de Problemas</a> •
  <a href="#licença">Licença</a>
</p>

## Sobre

O Daily Diet API é um backend completo desenvolvido com Node.js, Fastify e TypeScript que fornece uma API RESTful para gerenciar refeições e acompanhar dietas. Este projeto implementa práticas modernas de desenvolvimento como autenticação com cookies, criptografia de senha, validação de dados com Zod e banco de dados com SQLite e Knex.

## Funcionalidades

### 👤 Usuários
- ✅ Criação de conta com nome, email e senha (senha criptografada)
- ✅ Login com email e senha
- ✅ Autenticação via cookies HTTP-only
- ✅ Refresh token para sessões
- ✅ Proteção de rotas com middleware de autenticação

### 🍽️ Refeições
- ✅ Criar, listar, visualizar, editar e excluir refeições
- ✅ Registrar nome, descrição, data e hora da refeição
- ✅ Marcar refeição como dentro ou fora da dieta
- ✅ Associar refeições ao usuário autenticado

### 📊 Métricas
- ✅ Total de refeições registradas
- ✅ Total de refeições dentro da dieta
- ✅ Total de refeições fora da dieta
- ✅ Melhor sequência de refeições dentro da dieta

## Tecnologias

- **[Node.js](https://nodejs.org/)** - Ambiente de execução JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Fastify](https://www.fastify.io/)** - Framework web rápido e de baixo overhead
- **[Knex](http://knexjs.org/)** - Query builder SQL flexível
- **[SQLite](https://www.sqlite.org/)** - Banco de dados SQL leve
- **[Zod](https://github.com/colinhacks/zod)** - Validação de esquemas TypeScript-first
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Biblioteca para hashing de senhas
- **[@fastify/cookie](https://github.com/fastify/fastify-cookie)** - Plugin Fastify para gerenciamento de cookies

## Rotas

### Autenticação e Usuários

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/users` | Criar novo usuário | Não |
| POST | `/sessions` | Login (criar sessão) | Não |
| GET | `/users` | Buscar perfil do usuário | Sim |
| PUT | `/users` | Atualizar perfil | Sim |

### Refeições

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/meals` | Criar refeição | Sim |
| GET | `/meals` | Listar refeições | Sim |
| GET | `/meals/:id` | Buscar refeição específica | Sim |
| PUT | `/meals/:id` | Atualizar refeição | Sim |
| DELETE | `/meals/:id` | Excluir refeição | Sim |

### Métricas

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/meals/metrics` | Buscar métricas do usuário | Sim |

## Requisitos

Antes de começar, você precisa ter instalado:

- Node.js (versão 16.x até 22.x)
- Yarn (versão 1.22.x ou superior)
- Git (para clonar o repositório)
- Postman ou Insomnia (para testar a API)

## Instalação

### Configuração do Ambiente

#### macOS e Linux

1. Clone o repositório:
```bash
git clone https://github.com/ldiasm/daily-diet-api.git
cd daily-diet-api
```

2. Instale as dependências:
```bash
yarn
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

#### Windows

1. Clone o repositório:
```batch
git clone https://github.com/ldiasm/daily-diet-api.git
cd daily-diet-api
```

2. Instale as dependências:
```batch
yarn
```

3. Configure as variáveis de ambiente:
```batch
copy .env.example .env
```

## Banco de Dados

1. Execute as migrações:
```bash
yarn knex migrate:latest
```

> **Nota:** Todas as migrações foram unificadas no diretório `db/migrations` para simplificar o processo.

2. Para verificar quais migrações já foram executadas:
```bash
yarn knex migrate:list
```

3. Para reverter as migrações:
```bash
yarn knex migrate:rollback
```

## Desenvolvimento

### Iniciando o servidor

Para iniciar o servidor de desenvolvimento:

```bash
yarn dev
```

A API estará disponível em http://localhost:3333

### Scripts disponíveis

- `yarn dev` - Inicia o servidor de desenvolvimento
- `yarn build` - Compila o projeto para produção
- `yarn lint` - Executa o linter
- `yarn knex` - Executa comandos do Knex.js

### Estrutura do projeto

```
src/
  ├── @types/            # Definições de tipos TypeScript
  ├── database/          # Migrações e seeds do banco de dados
  ├── env/               # Configuração de variáveis de ambiente
  ├── middlewares/       # Middlewares do Fastify
  ├── routes/            # Definições de rotas da API
  ├── app.ts             # Configuração da aplicação Fastify
  ├── database.ts        # Configuração do banco de dados
  └── server.ts          # Ponto de entrada da aplicação
```

## Testando a API

1. Abra o Postman ou Insomnia
2. Importe o arquivo `daily-diet-collection.json`
3. Configure o ambiente "Dev" com a variável `baseURL=http://localhost:3333`
4. Teste os endpoints disponíveis

### Exemplo de requisição para criar usuário:

```http
POST http://localhost:3333/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "senha123"
}
```

### Exemplo de login:

```http
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "senha123"
}
```

## Solução de Problemas

### Erros Comuns

1. **Porta 3333 em uso**
   - Verifique se não há outro processo usando a porta
   - Altere a porta no arquivo .env

2. **Erro no banco de dados**
   - Verifique se o diretório `db` existe
   - Execute `yarn knex migrate:latest` novamente

3. **Erro ao iniciar o servidor**
   - Verifique se todas as dependências foram instaladas
   - Tente reinstalar com `yarn`

4. **Erro ao importar coleção no Postman**
   - Verifique se o arquivo da coleção existe
   - Tente criar as requisições manualmente

5. **Erro com TSX e Node.js 20.6.0 ou superior**
   - Se você receber o erro "tsx must be loaded with --import instead of --loader", edite o arquivo `package.json`
   - Altere o script "knex" para usar `--import tsx` em vez de `--loader tsx`
   - Exemplo: `"knex": "node --no-warnings --import tsx ./node_modules/.bin/knex"`
   - Exemplo de erro: `Error: tsx must be loaded with --import instead of --loader. The --loader flag was deprecated in Node v20.6.0`
   - **Solução rápida**: Para execução única sem editar o package.json, use:
     ```bash
     node --no-warnings --import tsx ./node_modules/.bin/knex migrate:latest
     ```

6. **Erro de sintaxe nas migrações (SyntaxError: missing ) after argument list)**
   - Este erro ocorre geralmente devido a problemas de sintaxe em arquivos de migração ou no knexfile
   - Abra o arquivo knexfile.ts e verifique se há erros de sintaxe
   - Verifique também os arquivos de migração no diretório `db/migrations`
   - Se estiver no Windows, problemas com caminhos de diretório podem causar esse erro
   - **Solução para Windows**: Execute o seguinte comando para migrar manualmente:
     ```bash
     # No Windows, usando PowerShell
     node --no-warnings --import=tsx -e "const { config } = require('./src/database'); const knex = require('knex')(config); knex.migrate.latest().then(() => { console.log('Migrações concluídas com sucesso!'); process.exit(0); }).catch((err) => { console.error('Erro nas migrações:', err); process.exit(1); });"

     # Ou usando o prompt de comando (cmd)
     node --no-warnings --import=tsx -e "const { config } = require('./src/database'); const knex = require('knex')(config); knex.migrate.latest().then(() => { console.log('Migrações concluídas com sucesso!'); process.exit(0); }).catch((err) => { console.error('Erro nas migrações:', err); process.exit(1); });"
     ```

### Logs e Debug

Para ver logs mais detalhados:

macOS/Linux:
```bash
DEBUG=* yarn dev
```

Windows:
```batch
set DEBUG=* && yarn dev
```

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
