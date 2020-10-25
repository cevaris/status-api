import rateLimit from 'express-rate-limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import socketIO from 'socket.io';
import { Presenter } from '../presenter';
import { EventException } from '../routes/public/firehose';

export const privateApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

const NotReadyMessage =
  'This endpoint is currently rate-limited. StatusAPI will provide a paid offering soon.';

export const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: NotReadyMessage,
});

const MaxStreamMs = 30 * 1000;
const socketConnectionLimiter = new RateLimiterMemory({
  points: 1,
  duration: (MaxStreamMs * 2) / 1000,
});
export async function socketIOLimiter(socket: socketIO.Socket, next: any) {
  setTimeout(() => {
    socket.emit(EventException, Presenter.rateLimited(NotReadyMessage));
    socket.disconnect(true);
  }, MaxStreamMs);

  try {
    const ipAddress = findIpAddress(socket);
    if (ipAddress !== '::1') {
      await socketConnectionLimiter.consume(ipAddress, 1);
    }
    next();
  } catch (error) {
    socket.emit(EventException, Presenter.rateLimited(NotReadyMessage));
    socket.disconnect(true);
  }
}

function findIpAddress(socket: socketIO.Socket): string {
  // https://cloud.google.com/appengine/docs/flexible/python/reference/request-headers
  const googleAppEngineForwardedFor =
    socket.handshake.headers['x-forwarded-for'];

  return googleAppEngineForwardedFor
    ? googleAppEngineForwardedFor.split(',')[0]
    : socket.handshake.address;
}
