import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiLogIn, FiUserPlus, FiLogOut } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [login, setLogin] = useState({ email: "", password: "" });
  const [isLoginView, setIsLoginView] = useState(true); // true = login, false = cadastro

  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, form);
      const desejaOutro = window.confirm(
        "Usuário cadastrado com sucesso!\nDeseja cadastrar outro usuário?"
      );
      if (!desejaOutro) {
        setForm({ name: "", email: "", password: "" });
        setIsLoginView(true);
      } else {
        setForm({ name: "", email: "", password: "" });
      }
    } catch (error) {
      alert(error.response?.data || "Erro ao cadastrar");
    }
  };

  const doLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, login);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (error) {
      alert("Credenciais inválidas");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: "Bearer " + token },
      });
      setUsers(res.data);
    } catch (error) {
      alert("Erro ao buscar usuários");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const inputStyle = {
    padding: "8px",
    margin: "5px 0",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "10px",
    marginTop: "10px",
    width: "100%",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  };

  const containerStyle = {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
    backgroundColor: "#fafafa",
  };

  if (!token) {
    return (
      <div style={containerStyle}>
        {isLoginView ? (
          <>
            <h2>Login</h2>
            <form onSubmit={doLogin}>
              <input
                style={inputStyle}
                placeholder="Email"
                type="email"
                value={login.email}
                onChange={(e) =>
                  setLogin({ ...login, email: e.target.value })
                }
                required
              />
              <input
                style={inputStyle}
                placeholder="Senha"
                type="password"
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
                required
              />
              <button style={buttonStyle} type="submit">
                <FiLogIn /> Entrar
              </button>
            </form>
            <p style={{ marginTop: "15px", textAlign: "center" }}>
              Primeiro acesso?{" "}
              <button
                onClick={() => setIsLoginView(false)}
                style={{ background: "none", border: "none", color: "#007BFF", cursor: "pointer" }}
              >
                Cadastrar
              </button>
            </p>
          </>
        ) : (
          <>
            <h2>Cadastro</h2>
            <form onSubmit={register}>
              <input
                style={inputStyle}
                placeholder="Nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                style={inputStyle}
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                style={inputStyle}
                placeholder="Senha"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
              <button style={buttonStyle} type="submit">
                <FiUserPlus /> Cadastrar
              </button>
            </form>
            <p style={{ marginTop: "15px", textAlign: "center" }}>
              Já tem cadastro?{" "}
              <button
                onClick={() => setIsLoginView(true)}
                style={{ background: "none", border: "none", color: "#007BFF", cursor: "pointer" }}
              >
                Fazer login
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

  // Tela de usuários autenticado
  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>Usuários Cadastrados</h2>

      <form onSubmit={register}>
        <input
          style={inputStyle}
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          style={inputStyle}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          style={inputStyle}
          placeholder="Senha"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button style={buttonStyle} type="submit">
          <FiUserPlus /> Cadastrar Novo Usuário
        </button>
      </form>

      <button
        onClick={logout}
        style={{
          ...buttonStyle,
          backgroundColor: "#e0e0e0",
          color: "#333",
          marginTop: "8px",
        }}
      >
        <FiLogOut /> Sair
      </button>

      <div style={{ marginTop: "30px" }}>
        {users.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>
            Nenhum usuário cadastrado.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {users.map((u) => (
              <li
                key={u.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "12px",
                  marginBottom: "10px",
                  backgroundColor: "#f1f1f1",
                }}
              >
                <strong style={{ fontSize: "16px" }}>{u.name}</strong>
                <p style={{ margin: "4px 0", color: "#555" }}>{u.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
