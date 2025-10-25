const db = require("../config/db");

// Adding a new expense
const addExpense = async (req, res) => {
  const { title, amount, date, category_id } = req.body;
  const user_id = req.user.id;

  if (!title || !amount || !category_id) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    await db.query(
      "INSERT INTO expenses (title, amount, date, category_id, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, amount, date || new Date(), category_id, user_id]
    );
    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Getting all expenses for a user
const getExpenses = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT e.id, e.title, e.amount, e.date, c.name AS category
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.user_id = ? ORDER BY e.date DESC`,
      [user_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const [result] = await db.query(
      "DELETE FROM expenses WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalExpense = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT SUM(amount) AS total FROM expenses WHERE user_id = ?",
      [user_id]
    );
    res.json({ total: rows[0].total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { addExpense, getExpenses, deleteExpense, getTotalExpense };
