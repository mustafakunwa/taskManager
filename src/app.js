const express = require('express');
require('./db/mongoose');
const app = express();

const taskRoute = require('./router/task');
const userRoute = require('./router/user');

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

module.exports = app;