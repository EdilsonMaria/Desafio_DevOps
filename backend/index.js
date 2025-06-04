const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "appdb",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

app.use(cors());
app.use(express.json());

// Conexão com banco
async function connectWithRetry() {
  const maxRetries = 10;
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await pool.query('SELECT 1');
      console.log('Conexão com o banco de dados bem-sucedida!');
      return;
    } catch (err) {
      retries++;
      console.log(`Tentativa ${retries} falhou. Retentando em 5 segundos...`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  throw new Error('Não foi possível conectar ao banco de dados após várias tentativas.');
}

(async () => {
  await connectWithRetry();
})();

// Registro de novo usuário
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  try {
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, password]
    );
    res.sendStatus(201);
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).send("Usuário já existe");
    } else {
      console.error("Erro ao registrar:", err);
      res.status(500).send("Erro interno no servidor");
    }
  }
});

// Listagem de usuários (sem autenticação)
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).send("Erro interno no servidor");
  }
});

app.listen(port, () => {
  console.log(`Servidor backend rodando na porta ${port}`);
});
