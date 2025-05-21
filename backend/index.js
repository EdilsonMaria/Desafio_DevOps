const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = "segredo_super_secreto";

const pool = new Pool({
  host: "db",
  user: "user",
  password: "password",
  database: "appdb",
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Criação da tabela, com tratamento de erro
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password TEXT
      );
    `);
    console.log("Tabela 'users' verificada/criada com sucesso.");
  } catch (err) {
    console.error("Erro ao criar/verificar a tabela 'users':", err);
  }
})();

// Middleware de autenticação JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Registro de novo usuário
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashed]
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

// Login de usuário
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email e senha são obrigatórios");
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      res.status(401).send("Credenciais inválidas");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).send("Erro interno no servidor");
  }
});

// Listagem de usuários (rota protegida)
app.get("/users", authenticateToken, async (req, res) => {
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
