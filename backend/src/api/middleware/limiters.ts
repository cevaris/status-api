import rateLimit from 'express-rate-limit';
import socketIO from 'socket.io';
import { Presenter } from '../presenter';
import { EventException } from '../routes/public/firehose';

export const NotReadyMessage =
  'This endpoint is not production ready yet and is currently heavily rate-limited. StatusAPI will provide a public offering soon.';

// restrict heavy traffic to private API
export const privateApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many API requests for this endpoint, try again later',
});

export const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  message: NotReadyMessage,
});

export function socketIOConnection(socket: socketIO.Socket, next: Function) {
  const connection = `${new Date().toISOString()}-${socket.client.id}`;
  socket.request.connectionId = connection;
  next();
}

// const MaxEmitCount = 10;
// const emitCountMap = new Map<string, number>();
export function socketIOLimiter(socket: socketIO.Socket, next: Function) {
  // const limiter = rateLimit({
  //   windowMs: 60 * 1000,
  //   max: 1,
  //   message: NotReadyMessage,
  //   handler: (req: any, res: any, expressNext: any) => {
  //     next(new Error(NotReadyMessage));
  //     socket.emit(EventException, Presenter.rateLimited(NotReadyMessage));
  //     socket.disconnect(true);
  //   },
  // });

  setTimeout(() => {
    next(new Error(NotReadyMessage));
    socket.emit(EventException, Presenter.rateLimited(NotReadyMessage));
    socket.disconnect(true);
  }, 30 * 1000);

  next();

  // // socket.request, socket.request.res, next;
  // const currEmitCount = emitCountMap.get(socket.client.id) || 0;
  // if (currEmitCount > MaxEmitCount) {
  //   socket.emit(EventException, Presenter.rateLimited(NotReadyMessage));
  //   // stream.end();
  //   socket.disconnect(true);
  // } else {
  //   console.log('increment', socket.client.id, currEmitCount);
  //   // increment emit count
  //   emitCountMap.set(socket.client.id, currEmitCount + 1);
  //   next();
  // }
}
