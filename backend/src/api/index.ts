import express from "express";
import { Config } from '../common/config';
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

const PORT = Config.port(8080);
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});