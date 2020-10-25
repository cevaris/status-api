import bodyParser from 'body-parser';
import express from 'express';
import { Config } from '../common/config';
import * as sessionAuth from './middleware/auth';
import * as cors from './middleware/cors';
import { privateApiLimiter, publicApiLimiter } from './middleware/limiters';
import { configureSocketIO } from './socketio';

const app: express.Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

sessionAuth.register(app);
cors.register(app);

app.use('/private/', privateApiLimiter);

// alter server name
app.use(function (_, res, next) {
  res.setHeader('X-Powered-By', "Wouldn't you like to know!");
  next();
});

app.use(require('./routes/private/auth'));
app.use(require('./routes/private/reportFailures'));
app.use(require('./routes/private/reportMetadata'));
app.use(require('./routes/private/reports'));
app.use(publicApiLimiter, require('./routes/public/reports'));
app.use(require('./routes/root'));

const PORT = Config.port(8080);
const listeningServer = app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

configureSocketIO(listeningServer);
