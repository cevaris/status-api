import http from 'http';
import socketIO from 'socket.io';
import { firehoseStatusReport } from './routes/public/firehose2';

export function configureSocketIO(server: http.Server): void {
    const io: socketIO.Server = socketIO(server);
    io.listen(server);

    io.on('connection', function (socket: socketIO.Socket) {
        firehoseStatusReport(socket);
    });
}