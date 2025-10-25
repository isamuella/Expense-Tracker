const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log('Authorization header:', req.headers.authorization);

    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not found" });
    }
};
module.exports = protect;