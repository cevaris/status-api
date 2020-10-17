import express from "express";
import { Config } from '../common/config';
import * as sessionAuth from './middleware/auth';
import * as cors from './middleware/cors';


const app = express();
sessionAuth.register(app);
cors.register(app);

app.use(sessionAuth.setUserAsLocal());

app.use(require('./routes/private/auth'));
app.use(require('./routes/private/reportFailures'));
app.use(require('./routes/private/reportMetadata'));
app.use(require('./routes/private/reports'));
app.use(require('./routes/public/reportFailures'));
app.use(require('./routes/public/streamReports'));
app.use(require('./routes/root'));

const PORT = Config.port(8080);
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});