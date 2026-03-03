# Node.js Server Template

Modelo de servidor REST API construído com **Node.js**, **Express** e **Prisma ORM**, pronto a ser usado como ponto de partida para novos projectos backend. Inclui autenticação JWT, documentação Swagger, rate limiting, logging estruturado, integração com Cloudinary e suporte a PostgreSQL.

---

## Tecnologias

| Camada          | Tecnologia                          |
| --------------- | ----------------------------------- |
| Runtime         | Node.js (CommonJS)                  |
| Framework       | Express 5                           |
| Base de dados   | PostgreSQL via Prisma ORM           |
| Autenticação    | JSON Web Tokens (JWT)               |
| Hashing         | bcrypt                              |
| Email           | Resend                 |
| Upload          | Cloudinary                          |
| Documentação    | Swagger UI (OpenAPI 3.0)            |
| Logging         | Winston                             |
| Segurança       | Helmet, CORS, express-rate-limit    |

---

## Estrutura do Projecto

```
 prisma/
    schema.prisma          # Esquema da base de dados
    migrations/            # Migrações SQL
 src/
    app.js                 # Configuração do Express
    server.js              # Entrada da aplicação
    configs/
       cloudinary.js      # Configuração do Cloudinary
       prisma.js          # Cliente Prisma
       swagger.js         # Configuração do Swagger
    controllers/
       user.controller.js # Controlador de utilizadores
    middlewares/
       auth.middleware.js  # Autenticação JWT
       errors.middleware.js# Tratamento de erros
    routes/
       index.router.js    # Rotas base (/, /health)
       user.router.js     # Rotas de utilizadores
    utils/
        logger.util.js     # Logger (Winston)
        mailer.util.js     # Utilitário de email
 logs/                      # Ficheiros de log (gerado automaticamente)
 .env.sample                # Variáveis de ambiente de exemplo
 package.json
 prisma.config.ts
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [PostgreSQL](https://www.postgresql.org/) >= 14

---

## Instalação

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd nodejs-server-template

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.sample .env
# Editar o ficheiro .env com os seus valores

# 4. Gerar o cliente Prisma
npm run db:generate

# 5. Executar as migrações
npm run db:migrate
```

---

## Variáveis de Ambiente

Copie `.env.sample` para `.env` e preencha os valores:

```env
# Servidor
PORT=20262
NODE_ENV=development

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=https://api.exemplo.com

# JWT
JWT_USER_SECRET=<segredo-utilizador>
JWT_ADMIN_SECRET=<segredo-admin>
JWT_USER_REFRESH_SECRET=<segredo-refresh-utilizador>
JWT_ADMIN_REFRESH_SECRET=<segredo-refresh-admin>
JWT_RESET_PASSWORD_SECRET=<segredo-reset-senha>
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=1d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend
RESEND_API_KEY=
EMAIL_FROM=

# Fuso horário
TZ=Africa/Luanda

# Base de dados
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

---

## Scripts Disponíveis

| Comando               | Descrição                                       |
| --------------------- | ----------------------------------------------- |
| `npm start`           | Inicia o servidor em produção                   |
| `npm run dev`         | Inicia o servidor em modo de desenvolvimento (watch) |
| `npm run db:generate` | Gera o cliente Prisma                           |
| `npm run db:migrate`  | Executa migrações (desenvolvimento)             |
| `npm run db:migrate:prod` | Executa migrações (produção)               |
| `npm run db:push`     | Sincroniza o esquema sem criar migração         |
| `npm run db:pull`     | Importa esquema da base de dados existente      |
| `npm run db:seed`     | Executa o seeder                                |
| `npm run db:reset`    | Reinicia a base de dados                        |
| `npm run db:studio`   | Abre o Prisma Studio                            |

---

## Rotas da API

### Base

| Método | Rota      | Descrição                   |
| ------ | --------- | --------------------------- |
| GET    | `/`       | Estado da API               |
| GET    | `/health` | Verificação de saúde (uptime)|

### Autenticação (`/users`)

| Método | Rota                          | Descrição                              |
| ------ | ----------------------------- | -------------------------------------- |
| POST   | `/users/check-email`          | Verificar email e enviar OTP           |
| POST   | `/users/verify-otp`           | Verificar código OTP                   |
| POST   | `/users/resend-otp`           | Reenviar código OTP                    |
| POST   | `/users/complete-registration`| Completar registo do utilizador        |
| POST   | `/users/login`                | Login de utilizador                    |
| POST   | `/users/admin/login`          | Login de administrador                 |
| POST   | `/users/request-password-reset`| Solicitar reset de senha              |
| POST   | `/users/reset-password`       | Redefinir senha                        |
| GET    | `/users/is-logged-in`         | Verificar sessão do utilizador         |
| GET    | `/users/admin/is-logged-in`   | Verificar sessão do administrador      |

### Gestão de Utilizadores (`/users`)  Requer Admin

| Método | Rota                   | Descrição                           |
| ------ | ---------------------- | ----------------------------------- |
| POST   | `/users/list`          | Listar utilizadores (com filtros e paginação) |
| PATCH  | `/users/update-role`   | Alterar role de utilizador          |
| PATCH  | `/users/toggle-status` | Ativar/suspender utilizador         |

---

## Documentação Swagger

Com o servidor em execução, aceda à documentação interativa em:

```
http://localhost:<PORT>/docs
```

---

## Modelo de Dados

### User

| Campo       | Tipo        | Descrição                             |
| ----------- | ----------- | ------------------------------------- |
| `id`        | UUID        | Identificador único                   |
| `name`      | String      | Nome                                  |
| `surname`   | String      | Apelido                               |
| `email`     | String      | Email (único)                         |
| `phone`     | String      | Telefone (único)                      |
| `password`  | String      | Password (bcrypt)                     |
| `role`      | Role        | `user` \| `ft`                        |
| `status`    | UserStatus  | `active` \| `inactive` \| `suspended` |
| `lastLogin` | DateTime    | Último login                          |
| `createdAt` | DateTime    | Data de criação                       |
| `updatedAt` | DateTime    | Data de actualização                  |

---

## Segurança

- **Helmet**  define cabeçalhos HTTP de segurança (CSP desactivado apenas em `/docs`)
- **CORS**  origens permitidas configuráveis via `corsOptions` em `app.js`
- **Rate Limiting global**  100 pedidos por minuto por IP
- **Rate Limiting de login**  5 tentativas por 15 minutos
- **JWT com renovação automática**  token renovado automaticamente quando faltam menos de 15 minutos para expirar (enviado no header `x-renewed-token`)
- **Separação de segredos**  tokens de utilizador e administrador usam segredos JWT distintos

---

## Logging

Os logs são guardados automaticamente na pasta `logs/` com o nome do dia:

- `logs/all-YYYY-MM-DD.log`  todos os níveis
- `logs/error-YYYY-MM-DD.log`  apenas erros

Também são exibidos no terminal com cores durante o desenvolvimento.

---

## Licença

MIT