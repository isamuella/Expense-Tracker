const db = require("../config/db");

const getCategories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories ORDER BY name ASC");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({ error: "Server error while fetching categories"});
    }
};

module.exports = { getCategories };
