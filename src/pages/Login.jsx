import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("http://localhost/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usr_NickName: nickname, usr_Password: password }),
    });
    const data = await res.json();

    if (res.ok){
      onLogin(data.token);
      navigate("/"); 
    } 
    else setError(data.error || "Login failed");

  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>
        <input
          className="w-full border p-2 rounded"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
