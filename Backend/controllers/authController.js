const db = require("../config/db");
const bcrypt = require("bcrypt");   // Library used for hashing passwords securely.
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (results.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword]);
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { registerUser, loginUser };
