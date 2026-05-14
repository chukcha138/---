import "./App.css";
import React, { useEffect, useState } from "react";
import API from "./api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function App() {
  const [history, setHistory] = useState([]);
  const [token, setToken] = useState(
  localStorage.getItem("token") || ""
);

  const [role, setRole] = useState(
  localStorage.getItem("role") || ""
);
  console.log("ROLE:", role);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [devices, setDevices] = useState([]);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [room, setRoom] = useState("");
const [responsible, setResponsible] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");




  const fetchDevices = async () => {
    try {
      const res = await API.get("/devices", {
        headers: {
Authorization: "Bearer " + token        }
      });
      console.log(res.data);
setDevices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

useEffect(() => {
  if (!token) return;

  fetchDevices();

  const interval = setInterval(() => {
    fetchDevices();
  }, 5000);

  return () => clearInterval(interval);
}, [token]);

  const addDevice = async () => {
    try {
      await API.post(
        "/devices",
        {
          name,
          type: "ПК",
          inventoryNumber: "INV-" + Date.now(),
          room,
responsible,
          status: "active",
          lastCheckDate: new Date(),
          ip
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      setName("");
      setIp("");

      fetchDevices();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDevice = async (id) => {
    try {
      await API.delete(`/devices/${id}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      fetchDevices();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(
        `/devices/${id}`,
        { status },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      fetchDevices();
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async (id) => {
    try {
      const res = await API.get(`/history/${id}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

if (!token) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffd6e7, #fff)"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          width: "320px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
          textAlign: "center"
        }}
      >
        <h1 style={{ color: "#ff4d94" }}>
          Tech Monitor
        </h1>

        <p style={{ color: "#777" }}>
          Система мониторинга техники
        </p>

        <input
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />

        <button
          onClick={async () => {
            try {
              const res = await API.post("/auth/login", {
                username: login,
                password
              });

              localStorage.setItem(
                "token",
                res.data.token
              );

              setToken(res.data.token);

              setRole(res.data.role);

              localStorage.setItem(
                "role",
                res.data.role
              );
            } catch (err) {
              alert("Ошибка входа");
            }
          }}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            border: "none",
            borderRadius: "10px",
            background: "#ff4d94",
            color: "white",
            cursor: "pointer"
          }}
        >
          Войти
        </button>

        <button
          onClick={async () => {
            try {
              await API.post("/auth/register", {
                username: login,
                password
              });

              alert("Пользователь создан");
            } catch (err) {
              alert("Пользователь уже существует");
            }
          }}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            border: "none",
            borderRadius: "10px",
            background: "#ffc2d9",
            color: "#333",
            cursor: "pointer"
          }}
        >
          Регистрация
        </button>
      </div>
    </div>
  );
}

  return (     
    <div style={{ padding: 20 }}>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    background: "white",
    padding: "15px 20px",
    borderRadius: "15px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
  }}
>
  <div>
    <h2 style={{ margin: 0, color: "#ff4d94" }}>
      Tech Monitor
    </h2>

    <small style={{ color: "#777" }}>
      Система мониторинга техники
    </small>
  </div>

  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
    <span>
      Роль: <b>{role}</b>
    </span>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setToken("");
        setRole("");
      }}
    >
      Выйти
    </button>
  </div>
</div>      


      <input
        placeholder="Название ПК"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
  placeholder="IP адрес"
  value={ip}
  onChange={(e) => setIp(e.target.value)}
/>

      {role === "admin" && (
  <button onClick={addDevice}>Добавить</button>
)}

      <br /><br />

      <input
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">Все</option>
        <option value="active">Работает</option>
        <option value="repair">Ремонт</option>
        <option value="written_off">Списан</option>
      </select>

      <hr />

      {devices
        .filter((d) => {
          const matchesSearch = d.name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchesStatus = statusFilter
            ? d.status === statusFilter
            : true;

          return matchesSearch && matchesStatus;
        })
        .map((d) => {
          const lastCheck = new Date(d.lastCheckDate);
          const now = new Date();
          const diffDays =
            (now - lastCheck) / (1000 * 60 * 60 * 24);
          const needsCheck = diffDays > 30;

          return (
            <div
              key={d._id}
              className="card"
              style={{
                border: needsCheck ? "2px solid red" : "1px solid #eee"
              }}
            >
              <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  <h3 style={{ margin: 0 }}>
    💻 {d.name}
  </h3>

  <span
    style={{
  background: d.isOnline
    ? "#dcfce7"
    : "#fee2e2",

  color: d.isOnline
    ? "#15803d"
    : "#b91c1c",

  padding: "6px 14px",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "16px"
}}
  >
    {d.isOnline ? "Online" : "Offline"}
  </span>
</div>

<div
  style={{
    display: "flex",
    gap: "15px",
    marginTop: "10px",
    flexWrap: "wrap"
  }}
>
  <span>CPU: {d.monitoring?.cpu}%</span>
  <span>RAM: {d.monitoring?.ram}%</span>
  <span>Disk: {d.monitoring?.disk}%</span>
</div>

<div
  style={{
    display: "flex",
    gap: "15px",
    marginTop: "15px",
    flexWrap: "wrap"
  }}
>
  {[
    {
      title: "CPU",
      value: d.monitoring?.cpu || 0,
      color: "#4ade80"
    },
    {
      title: "RAM",
      value: d.monitoring?.ram || 0,
      color: "#60a5fa"
    },
    {
      title: "Disk",
      value: d.monitoring?.disk || 0,
      color: "#f59e0b"
    }
  ].map((item) => (
    <div
      key={item.title}
      style={{
      background:
        item.title === "CPU"
          ? "#ecfdf3"
          : item.title === "RAM"
          ? "#eff6ff"
          : "#fff7ed",

      border: `2px solid ${item.color}30`,
      borderRadius: "15px",
      padding: "15px",
      minWidth: "160px",
      flex: 1,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#777"
        }}
      >
        {item.title}
      </p>

      <h2
        style={{
          margin: "10px 0",
          color: item.color
        }}
      >
        {item.value}%
      </h2>

      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#eee",
          borderRadius: "10px"
        }}
      >
        <div
          style={{
            width: `${item.value}%`,
            height: "100%",
            background: item.color,
            borderRadius: "10px"
          }}
        />
      </div>
    </div>
  ))}
</div>
              {needsCheck && (
                <p style={{ color: "red" }}>
                  Требуется проверка
                </p>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
  {role === "admin" ? (
    <select
      value={d.status}
      onChange={(e) =>
        updateStatus(d._id, e.target.value)
      }
    >
      <option value="active">Работает</option>
      <option value="repair">Ремонт</option>
      <option value="written_off">Списан</option>
    </select>
  ) : (
    <p>Статус: {d.status}</p>
  )}

  {role === "admin" && (
  <button onClick={() => deleteDevice(d._id)}>
    Удалить
  </button>
)}

  <button onClick={() => loadHistory(d._id)}>
    История
  </button>
</div>
            </div>
          );
        })}

      <hr />

      <h2>История изменений</h2>

      {history.map((h) => (
        <div key={h._id}>
          <p>
            {h.field}: {h.oldValue} → {h.newValue}
          </p>
          <small>{new Date(h.date).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default App;