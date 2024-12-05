const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/models', express.static(path.join(__dirname, 'models')));
app.use(express.json());
const itemsRoutes = require('./routes/items');
app.use('/api', itemsRoutes);

const db = new sqlite3.Database('./database.db');
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            date_created TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
