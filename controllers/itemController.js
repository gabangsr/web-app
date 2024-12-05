const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const getAllItems = (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(rows);
    });
};

const createItem = (req, res) => {
    const { name, description, date_created } = req.body;
    if (!name) {
        return res.status(400).send('Name is required');
    }

    const stmt = db.prepare('INSERT INTO items (name, description, date_created) VALUES (?, ?, ?)');
    stmt.run(name, description, date_created, function(err) {
        if (err) {
            console.error('Error adding item:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ id: this.lastID, name, description, date_created });
    });
};

const updateItem = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const stmt = db.prepare('UPDATE items SET name = ?, description = ? WHERE id = ?');
    stmt.run(name, description, id, function(err) {
        if (err) {
            console.error('Error updating item:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json({ id, name, description });
    });
};

const deleteItem = (req, res) => {
    try {
        const { id } = req.params;
        db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error('Error checking item existence:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (!row) {
                return res.status(404).send('Item not found');
            }

            db.run('DELETE FROM items WHERE id = ?', [id], (err) => {
                if (err) {
                    console.error('Error deleting item:', err);
                    return res.status(500).send('Internal Server Error');
                }

                db.get('SELECT COUNT(*) AS count FROM items', (err, row) => {
                    if (err) {
                        console.error('Error checking item count:', err);
                        return res.status(500).send('Internal Server Error');
                    }

                    if (row.count === 0) {
                        db.run("DELETE FROM sqlite_sequence WHERE name = 'items';", (err) => {
                            if (err) {
                                console.error('Error resetting auto-increment counter:', err);
                                return res.status(500).send('Internal Server Error');
                            }

                            console.log('Auto-increment reset successfully');
                        });
                    }

                    res.status(200).send('Item deleted');
                });
            });
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    getAllItems,
    createItem,
    updateItem,
    deleteItem,
};
