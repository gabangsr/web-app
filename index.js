const express = require ('express');
const app = express();
const port = 3000;

app.get('/',(req, res) => (
    res.send('Hello World')
));

app.get('/show',(req, res) => (
    res.send('Do you know that this is real?')
));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});