import { useState } from "react";
import { register } from "../services/auth";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        if (!username || !password) {
            alert("All fields required");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            await register(username, password);
            alert("Registered successfully!");
            window.location.href = "/login";
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Register</h2>

            <input
                placeholder="username"
                onChange={e => setUsername(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="password"
                onChange={e => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleRegister}>Register</button>
        </div>
    );
}