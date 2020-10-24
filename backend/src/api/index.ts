import bodyParser from 'body-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { Config } from '../common/config';
import * as sessionAuth from './middleware/auth';
import * as cors from './middleware/cors';
import { configureSocketIO } from './socketio';

const app: express.Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

sessionAuth.register(app);
cors.register(app);

// restrict heavy traffic to private API
const privateApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many API requests for this endpoint, try again later',
});
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
app.use(require('./routes/public/reports'));
app.use(require('./routes/root'));

const PORT = Config.port(8080);
const listeningServer = app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

configureSocketIO(listeningServer);
