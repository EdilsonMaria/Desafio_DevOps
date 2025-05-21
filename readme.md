# Aplicação Fullstack de Cadastro de Usuários com Docker

Esta é uma aplicação fullstack composta por **frontend em React**, **backend em Node.js** e **banco de dados PostgreSQL**, com foco na **dockerização da aplicação**.

O objetivo da aplicação é permitir que usuários se cadastrem informando **nome**, **email** e **senha**, através de um formulário no frontend. Os dados são enviados via API REST para o backend, que os salva no banco de dados PostgreSQL.

---

## 📦 Dockerização

A aplicação está completamente dockerizada usando `Docker` e `Docker Compose`. Isso facilita o deploy, o setup e garante ambiente unificado entre dev e produção.

### Estrutura da Dockerização

- `Dockerfile` no frontend e backend para criação das imagens
- `docker-compose.yml` na raiz para orquestrar os serviços
- Volumes e rede Docker conectando frontend, backend e banco

Para subir toda a aplicação com Docker:

```bash
docker-compose up --build
```

A aplicação estará disponível em `http://localhost:3000`.

---

## 📁 Estrutura do Projeto

```
Web_Work/
├── backend/
│   ├── tests/
│   │   └── auth.test.js
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── tests/
│   │   │   └── App.test.js
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── .env
├── .gitignore
├── docker-compose.yml
├── start-dev.sh
└── readme.md
```

---

## 🚀 Tecnologias Utilizadas

- Frontend: React + Axios
- Backend: Node.js + Express + pg
- Banco de dados: PostgreSQL
- Comunicação: API REST
- Docker e Docker Compose
- Ferramentas: VSCode, Postman, pgAdmin

---

## 🛠️ Pré-requisitos

### ✔️ Para rodar **com Docker** (recomendado):
- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### ✔️ Para rodar **localmente (sem Docker)**:
- Node.js (v18+)
- PostgreSQL (v13+ ou superior)
- npm ou yarn

---

## 🐘 Configuração do PostgreSQL (modo manual - sem Docker)

1. Crie um banco de dados chamado:

```
appdb
```

2. Dados de acesso padrão:

- Host: `localhost`
- Porta: `5432`
- Usuário: `user`
- Senha: `password`
- Banco: `appdb`

> ⚠️ A tabela será criada automaticamente na primeira execução com:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password TEXT
);
```

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend` (opcional):

```env
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_DATABASE=appdb
DB_PORT=5432
JWT_SECRET=segredo_super_secreto
```

> **Observação:** No código atual, os valores estão fixos, mas podem ser parametrizados facilmente utilizando a biblioteca `dotenv`.

---

## 🚀 Como rodar localmente (sem Docker)

### 1️⃣ Clonar o projeto

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd Web_Work
```

### 2️⃣ Rodar o Backend

```bash
cd backend
npm install
node index.js
```

A API estará disponível em:

```
http://localhost:5000
```

### 3️⃣ Rodar o Frontend

```bash
cd frontend
npm install
npm start
```

O frontend estará acessível em:

```
http://localhost:3000
```

---

## 🔐 Endpoints da API

| Método | Endpoint   | Descrição                     | Autenticação |
|--------|------------|-------------------------------|---------------|
| POST   | /register  | Cadastrar novo usuário        | ❌            |
| POST   | /login     | Login, retorna token JWT      | ❌            |
| GET    | /users     | Lista todos os usuários       | ✅ JWT        |

---

## ✅ Teste com CURL (Exemplo)

### Cadastro:

```bash
curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"name":"Maria","email":"maria@email.com","password":"123456"}'
```

### Login:

```bash
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"email":"maria@email.com","password":"123456"}'
```

### Listagem de usuários (com JWT):

```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" http://localhost:5000/users
```

---

## 👨‍💻 Autor

Projeto desenvolvido por [Seu Nome].

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT.