const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const db = new sqlite3.Database("database.db");

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
)
`);

// READ
app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        res.json(rows);
    });
});

// CREATE
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    res.sendStatus(200);
});

// UPDATE
app.put("/users/:id", (req, res) => {
    const { name, email } = req.body;
    db.run(
        "UPDATE users SET name=?, email=? WHERE id=?",
        [name, email, req.params.id]
    );
    res.sendStatus(200);
});

// DELETE SINGLE USER
app.delete("/users/:id", (req, res) => {
    db.run("DELETE FROM users WHERE id=?", [req.params.id]);
    res.sendStatus(200);
});

// DELETE ALL USERS  
app.delete("/users", (req, res) => {
    db.run("DELETE FROM users", [], (err) => {
        if (err) {
            res.status(500).send("Error deleting users");
        } else {
            res.sendStatus(200);
        }
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
