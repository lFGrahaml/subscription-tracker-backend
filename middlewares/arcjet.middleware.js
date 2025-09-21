import aj from "../config/arcjet.config.js";

const rateLimiter = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 2 });

    console.log('outside');
    if (decision.isDenied()) {
      console.log(decision.reason);
      if (decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate Limit exceeded' });
      if (decision.reason.isBot()) return res.status(403).json({ error: 'Bot Usage Detected' });

      return res.status(403).json({ error: 'Forbidden' })
    }

    next();
  } catch (error) {
    console.log('Arcjet Middleware Error: ', error);
    next(error);
  }
}

export default rateLimiter;