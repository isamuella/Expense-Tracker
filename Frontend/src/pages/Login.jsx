import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const [form, setForm] = useState({ username:"", email:"", password:""});
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", form);
            login({ ...res.data.user, token: res.data.token });
            navigate("/dashboard");
        } catch(err) {
            setMsg("Invalid credentials")
            console.error("Login error:", err.response?.data || err);
        }
    }

    return (
        <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
        </form>
        <p>{msg}</p>
        </div>
    );
};

export default Login;