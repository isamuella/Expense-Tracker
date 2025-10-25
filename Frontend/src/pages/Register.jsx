import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function Register() {
    const [form, setForm] = useState({ username:"", email:"", password:""});
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => 
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register", form);
            setMsg("Registered successfully!");
            setTimeout(() => navigate("/"), 1500);
        } catch(err) {
            setMsg("Error:" + err.response?.data?.message || "Failed to register");
        }
    }

    return (
        <div>
            <h2>Register</h2>
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
                <button type="submit">Register</button>
            </form>
            <p>{msg}</p>
        </div>
    )
};

export default Register;