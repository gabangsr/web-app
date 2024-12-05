const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

module.exports = {
    getAllItems: (callback) => {
        db.all('SELECT * FROM items', [], callback);
    },

    getItemById: (id, callback) => {
        db.get('SELECT * FROM items WHERE id = ?', [id], callback);
    },

    createItem: (name, description, date_created, callback) => {
        const query = 'INSERT INTO items (name, description, date_created) VALUES (?, ?, ?)';
        db.run(query, [name, description, date_created], function (err) {
            callback(err, this.lastID);
        });
    },

    updateItem: (id, name, description, callback) => {
        const query = 'UPDATE items SET name = ?, description = ? WHERE id = ?';
        db.run(query, [name, description, id], function (err) {
            callback(err, this.changes);
        });
    },

    partiallyUpdateItem: (id, name, description, callback) => {
        const query = 'UPDATE items SET name = ?, description = ? WHERE id = ?';
        db.run(query, [name, description, id], function (err) {
            callback(err, this.changes);
        });
    },

    deleteItem: (id, callback) => {
        db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
            callback(err, this.changes);
        });
    },

    resetAutoIncrement: (callback) => {
        db.run("DELETE FROM sqlite_sequence WHERE name='items'", callback);
    }
};
