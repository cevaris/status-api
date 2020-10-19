import express from "express";
import { Server } from 'http';
import requestIp from 'request-ip';
import socketIO from 'socket.io';
import { Config } from '../common/config';
import * as sessionAuth from './middleware/auth';
import * as cors from './middleware/cors';
import { statusReportFirehose } from "./routes/public/firehose2";


const app: express.Express = express();
const io: socketIO.Server = socketIO(new Server(app));

sessionAuth.register(app);
cors.register(app);

app.use(requestIp.mw())
app.use(sessionAuth.setUserAsLocal());
app.use(function (req: any, res, next) {
    req.io = io;
    next();
});

app.use(require('./routes/private/auth'));
app.use(require('./routes/private/reportFailures'));
app.use(require('./routes/private/reportMetadata'));
app.use(require('./routes/private/reports'));
app.use(require('./routes/public/firehose'));
app.use(require('./routes/public/reports'));
app.use(require('./routes/root'));

const PORT = Config.port(8080);


io.listen(
    app.listen(PORT, () => {
        console.log(`server started at http://localhost:${PORT}`);
    })
);

declare global {
    namespace Express {
        interface Request {
            io: socketIO.Server;
        }
    }
}

io.on('connection', function (socket: socketIO.Socket) {
    statusReportFirehose(socket);
});
