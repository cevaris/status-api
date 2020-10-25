import http from 'http';
import socketIO from 'socket.io';
import { firehoseStatusReport } from './routes/public/firehose';

export function configureSocketIO(server: http.Server): void {
  const io: socketIO.Server = socketIO.listen(server);
  io.of('/reports/firehose')
    .on('connection', function (socket: socketIO.Socket) {
      firehoseStatusReport(socket);
    });
}
