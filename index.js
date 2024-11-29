const express = require('express');
const app = express(); 
const port = 3000;
const db = require('./database');

app.use(express.json());

app.get('/', (req, res) => {
    console.log('Root route accessed'); 
    res.send('Hello World');
});

app.get('/show', (req, res) => {
    console.log('Show route accessed');
    res.send('Do you know that this is real?');
});

app.get('/database', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error fetching items from the database');
        }
        res.json(rows);
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
