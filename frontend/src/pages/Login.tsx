import { useState } from "react";
import { login } from "../services/auth";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {

            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }

            const data = await login(username, password);

            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("token", data.token);
            window.location.href = "/";

        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input onChange={e => setUsername(e.target.value)} placeholder="username" />
            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}