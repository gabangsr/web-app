const itemsModel = require('../models/itemModels');

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

exports.getAllItems = (req, res) => {
    itemsModel.getAllItems((err, rows) => {
        if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).json({ error: 'Failed to fetch items' });
        }

        const formattedRows = rows.map(item => ({
            ...item,
            date_created: formatDate(item.date_created)
        }));

        res.json(formattedRows);
    });
};

exports.createItem = (req, res) => {
    const { name, description } = req.body;
    const date_created = formatDate(new Date());

    if (!name) {
        return res.status(400).json({ error: 'Item name is required' });
    }

    itemsModel.createItem(name, description || null, date_created, (err, itemId) => {
        if (err) {
            console.error('Error adding item:', err);
            return res.status(500).json({ error: 'Failed to add item' });
        }

        itemsModel.getAllItems((err, rows) => {
            if (err) return;

            if (rows.length === 1) {
                itemsModel.resetAutoIncrement(() => {
                    console.log('AUTOINCREMENT reset');
                });
            }
        });

        res.status(201).json({
            id: itemId,
            name,
            description: description || null,
            date_created,
        });
    });
};

exports.updateItem = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Item name is required' });
    }

    itemsModel.updateItem(id, name, description || null, (err, changes) => {
        if (err) {
            console.error('Error updating item:', err);
            return res.status(500).json({ error: 'Failed to update item' });
        }
        if (changes === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Item updated successfully' });
    });
};

exports.partiallyUpdateItem = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name && !description) {
        return res.status(400).json({ error: 'At least one field (name or description) is required for partial update' });
    }

    itemsModel.partiallyUpdateItem(id, name || '', description || '', (err, changes) => {
        if (err) {
            console.error('Error partially updating item:', err);
            return res.status(500).json({ error: 'Failed to partially update item' });
        }
        if (changes === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Item partially updated successfully' });
    });
};

exports.deleteItem = (req, res) => {
    const { id } = req.params;

    itemsModel.deleteItem(id, (err, changes) => {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).json({ error: 'Failed to delete item' });
        }
        if (changes === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        itemsModel.getAllItems((err, rows) => {
            if (err) return;

            if (rows.length === 0) {
                itemsModel.resetAutoIncrement(() => {
                    console.log('AUTOINCREMENT counter reset');
                });
            }
        });

        res.status(200).json({ message: 'Item deleted successfully' });
    });
};
