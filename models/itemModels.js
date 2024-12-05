const ItemModel = (() => {
    const fetchItems = async () => {
        try {
            const response = await fetch('/api/items');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const items = await response.json();
            displayItems(items);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const displayItems = (items) => {
        const itemsList = document.getElementById('items-list');
        itemsList.innerHTML = items.map(item => `
            <tr class="border-t">
                <td class="py-2 px-4">${item.id}</td>
                <td class="py-2 px-4">${item.name}</td>
                <td class="py-2 px-4">${item.description || 'No description'}</td>
                <td class="py-2 px-4">${formatDate(item.date_created)}</td>
                <td class="py-2 px-4">
                    <button class="edit-button px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mr-2" onclick="editItem(${item.id}, '${item.name}', '${item.description || ''}')">Edit</button>
                    <button class="delete-button px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onclick="deleteItem(${item.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    };

    const addItem = async (name, description) => {
        const date_created = new Date().toISOString();
        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, date_created }),
            });
            if (!response.ok) {
                throw new Error('Failed to create item');
            }
            fetchItems(); 
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const saveEdit = async (id, name, description) => {
        try {
            const response = await fetch(`/api/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            });
            if (!response.ok) {
                throw new Error('Failed to update item');
            }
            fetchItems();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const confirmDelete = async (id) => {
        try {
            const response = await fetch(`/api/items/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return {
        fetchItems,
        addItem,
        saveEdit,
        confirmDelete,
    };
})();
window.ItemModel = ItemModel;
