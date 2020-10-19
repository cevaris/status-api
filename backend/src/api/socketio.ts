import http from 'http';
import socketIO from 'socket.io';
import { firehoseStatusReport } from './routes/public/firehose2';

export function configureSocketIO(server: http.Server): void {
    const io: socketIO.Server = socketIO.listen(server, { path: '/reports/firehose' });

    io.on('connection', function (socket: socketIO.Socket) {
        console.log(socket.handshake.query);
        firehoseStatusReport(socket);
    });
}