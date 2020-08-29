require('dotenv').config();

import express from "express";
import Config from './config';
import * as sessionAuth from './middleware/auth';
import * as cors from './middleware/cors';


const app = express();
sessionAuth.register(app);
cors.register(app);

app.use(sessionAuth.setUserAsLocal());

app.use(require('./routes/me'));
app.use(require('./routes/auth'));
app.use(require('./routes/reports'));
app.use(require('./routes/reportMetadata'));

app.get("/", (req, res) => {
    res.send("Status API");
});

app.listen(Config.Port, () => {
    console.log(`server started at http://localhost:${Config.Port}`);
});