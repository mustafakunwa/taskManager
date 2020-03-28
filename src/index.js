const express = require('express');
require('./db/mongoose');
const app = express();
const port = process.env.PORT;
const taskRoute = require('./router/task');
const userRoute = require('./router/user');

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);




app.listen(port, () => {
    console.log('server is running on port :', port);
})