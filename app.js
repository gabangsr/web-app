const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const itemsRoutes = require('./routes/items');

// Use the routes under the '/api' prefix
app.use('/api', itemsRoutes);

// Serve static files for your frontend (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
