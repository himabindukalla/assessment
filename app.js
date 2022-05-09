
const express = require('express');
const config = require('./config/config');
// const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
const PORT = config.port || 3000;
// app.set('port', 3000)


app.use('/', router);
app.listen(PORT, () => {
    console.log('listening on port ' + `${PORT}`);
});