/**
 * In-memory sliding-window rate limiter for sensitive endpoints
 */
const rateMap = new Map();

export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 20, message = 'Too many requests, please try again later.' }) {
  // Clean up old entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateMap.entries()) {
      if (now - record.resetTime > windowMs) {
        rateMap.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const key = `${req.baseUrl || req.path}:${ip}`;

    let record = rateMap.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      rateMap.set(key, record);
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: retryAfter
      });
    }

    return next();
  };
}

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 30, // 30 requests per 15 mins
  message: 'Too many login or registration attempts from this IP, please try again later.'
});
