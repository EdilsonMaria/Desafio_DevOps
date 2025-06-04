import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUserPlus } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, form);
      alert("Usuário cadastrado com sucesso!");
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data || "Erro ao cadastrar");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      alert("Erro ao buscar usuários");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>Cadastro de Usuários</h2>

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
          <FiUserPlus /> Cadastrar Usuário
        </button>
      </form>

      <div style={{ marginTop: "30px" }}>
        <h3 style={{ textAlign: "center" }}>Usuários Cadastrados</h3>
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
