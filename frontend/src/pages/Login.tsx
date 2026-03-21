import { useState } from "react";
import { login } from "../services/auth";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const token = localStorage.getItem("token");

    fetch("/visits", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const handleLogin = async () => {
        try {
            const data = await login(username, password);
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("token", data.token);
            window.location.href = "/";
        } catch {
            alert("Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input onChange={e => setUsername(e.target.value)} placeholder="username" />
            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}