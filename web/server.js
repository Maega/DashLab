const express = require('express');
const app = express();
const port = 1338;

// Root Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Listener
app.listen(port, () => console.log(`DashLab Web Server is running on port ${port}`));