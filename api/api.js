const express = require('express');
const app = express();
const cors = require('cors');
const port = 1337;

app.use(cors());

// ! Temporary, start the web server
require('../web/server');

// Routes
app.use('/installer', require('./installer.api'));

// Root Route
app.get('/', (req, res) => {
    res.send('DashLab API is online!');
});

// Listener
app.listen(port, () => console.log(`DashLab API is running on port ${port}`));