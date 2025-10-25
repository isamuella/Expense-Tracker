import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ title: "", amount: "", category: "", date: "" });
    const [total, setTotal] = useState(0);
    const [msg, setMsg] = useState("");
    const [filter, setFilter] = useState("");
    const [categoryTotals, setCategoryTotals] = useState({});

    useEffect(() => {
        if (!user) navigate("/");
        else {
        fetchCategories();
        fetchExpenses();
        }
    }, [user]);

    const username = user?.username ?? user?.user?.username ?? "";
    const token = user?.token ?? user?.user?.token ?? "";

    const fetchCategories = async () => {
        try {
        const res = await api.get("/categories", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
        } catch (err) {
        console.error("Fetch categories error:", err.response?.data || err);
        }
    };

    const computeCategoryTotals = (expensesList = [], categoriesList = []) => {
        const totals = {};
        expensesList.forEach((exp) => {
            const id = exp.category_id ?? exp.category ?? exp.categoryId ?? null;
            const amount = Number(exp.amount ?? 0);
            const catObj = categoriesList.find(c => Number(c.id) === Number(id));
            const name = catObj ? catObj.name : (id !== null ? String(id) : "Uncategorized");
            totals[name] = (totals[name] || 0) + (isNaN(amount) ? 0 : amount);
        });
        return totals;
    };

    const fetchExpenses = async () => {
        try {
            const res = await api.get("/expenses", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setExpenses(res.data);
            setTotal(res.data.reduce((s, it) => s + Number(it.amount || 0), 0));
            setCategoryTotals(computeCategoryTotals(res.data, categories));
        } catch (err) {
            console.error("Fetch expenses error:", err);
        }
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const payload = {
            title: form.title,
            amount: parseFloat(form.amount),
            date: form.date,
            category_id: Number(form.category)
        };

        await api.post("/expenses", payload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setMsg("Expense added!");
        setForm({ title: "", amount: "", category: "", date: "" });
        fetchExpenses();
        } catch (err) {
        console.error("Add expense error:", err.response?.data || err);
        setMsg("Failed to add expense");
        }
    };

    const deleteExpense = async (id) => {
        try {
        await api.delete(`/expenses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchExpenses();
        } catch (err) {
        console.error(err);
        }
    };

    const categoryName = (id) => {
        const cat = categories.find((c) => c.id === id || c.id === Number(id));
        return cat ? cat.name : id;
    };

    return (
        <div>
            <h2>Welcome, {username}!</h2>
            <button onClick={logout}>Logout</button>

            <h3>Add New Expense</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Expense title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                />

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                >
                <option value="">Select category</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
                </select>

                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Add Expense</button>
            </form>
            <p>{msg}</p>

            <h3>Your Expenses</h3>
            <table border="1" style={{ margin: "auto" }}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses
                        .filter((exp) => !filter || exp.category_id === Number(filter))
                        .map((exp) => (
                        <tr key={exp.id}>
                            <td>{exp.title}</td>
                            <td>${exp.amount}</td>
                            <td>{categoryName(exp.category_id || exp.category)}</td>
                            <td>
                            <button onClick={() => deleteExpense(exp.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Total Spent: ${total}</h3>
            {/* Totals by category summary */}
            <h3>Totals by Category</h3>
            <table border="1" style={{ margin: "auto" }}>
                <thead>
                    <tr>
                    <th>Category</th>
                    <th>Total Spent</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(categoryTotals).map(([catId, total]) => (
                        <tr key={catId}>
                            <td>{categoryName(catId)}</td>
                            <td>${total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;