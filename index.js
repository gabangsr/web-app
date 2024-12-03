const express = require('express');
const app = express();
const port = 3000;
const db = require('./database'); 
const path = require('path');

app.use(express.json());

app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/show', (req, res) => {
    console.log('Show route accessed');
    res.send('Do you know that this is real?');
});

app.get('/database', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error fetching items from the database');
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
