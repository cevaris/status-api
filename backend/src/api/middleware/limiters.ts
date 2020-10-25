import rateLimit from 'express-rate-limit';

// restrict heavy traffic to private API
export const privateApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many API requests for this endpoint, try again later',
});

export const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  message:
    'This endpoint is not production ready yet and is currently heavily rate-limited. StatusAPI will provide a public offering soon.',
});
