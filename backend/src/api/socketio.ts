import http from 'http';
import socketIO from 'socket.io';
import { socketIOConnection, socketIOLimiter } from './middleware/limiters';
import { firehoseStatusReport } from './routes/public/firehose';

export function configureSocketIO(server: http.Server): void {
  const io: socketIO.Server = socketIO.listen(server);
  io.of('/reports/firehose')
    .use(socketIOConnection)
    .use(socketIOLimiter)
    .on('connection', function (socket: socketIO.Socket) {
      // function next() {
      //   socket.emit(EventException, Presenter.rateLimited(NotReadyMessage));
      //   socket.disconnect(true);
      // }
      // publicApiLimiter(socket.request, socket.request.res, next);
      firehoseStatusReport(socket);
    });
}
