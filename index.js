const express = require ('express');
const app = express();
const port = 3000;

app.get('/',(req, res) => (
    res.send('Hello World')
));

app.get('/',(req, res) => (
    res.send('Do you know that this is real?')
));

app.get('/',(req, res) => (
    res.send('Not sure on how this feels?')
));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});