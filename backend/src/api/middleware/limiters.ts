import rateLimit from 'express-rate-limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import socketIO from 'socket.io';
import { Presenter } from '../presenter';
import { EventException } from '../routes/public/firehose';

export const NotReadyMessage =
  'This endpoint is not production ready yet and is currently heavily rate-limited. StatusAPI will provide a paid offering soon.';

// restrict heavy traffic to private API
export const privateApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many API requests for this endpoint, try again later',
});

export const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: NotReadyMessage,
});

export function socketIOConnection(socket: socketIO.Socket, next: Function) {
  const connection = `${new Date().toISOString()}-${socket.client.id}`;
  socket.request.connectionId = connection;
  next();
}

// export const firehoseLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 1,
//   message: NotReadyMessage
// });

// const MaxEmitCount = 10;
// const emitCountMap = new Map<string, number>();
// const ipRateLimiter = new Map<string, number>();
const MaxStreamMs = 30 * 1000;
const socketConnectionLimiter = new RateLimiterMemory({
  points: 1,
  duration: MaxStreamMs * 2,
});
export async function socketIOLimiter(socket: socketIO.Socket, next: any) {
  setTimeout(() => {
    socket.emit(EventException, Presenter.rateLimited(NotReadyMessage));
    socket.disconnect(true);
  }, MaxStreamMs);

  try {
    const ipAddress = findIpAddress(socket);
    await socketConnectionLimiter.consume(ipAddress, 1);
    next();
  } catch (error) {
    socket.emit(EventException, Presenter.rateLimited(NotReadyMessage));
    socket.disconnect(true);
  }

  // socket.request.mark = () => {
  //   const currEmitCount = emitCountMap.get(socket.client.id) || 0;
  //   if (currEmitCount > MaxEmitCount) {
  //     socket.emit(EventException, Presenter.rateLimited(NotReadyMessage));
  //     socket.disconnect(true);
  //   } else {
  //     console.log('increment', socket.client.id, currEmitCount);
  //     // increment emit count
  //     emitCountMap.set(socket.client.id, currEmitCount + 1);
  //   }
  // };

  // next();
}

function findIpAddress(socket: socketIO.Socket): string {
  // https://cloud.google.com/appengine/docs/flexible/python/reference/request-headers
  const googleAppEngineForwardedFor =
    socket.handshake.headers['x-forwarded-for'];

  return googleAppEngineForwardedFor
    ? googleAppEngineForwardedFor.split(',')[0]
    : socket.handshake.address;
}
