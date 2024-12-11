const rateLimit = require("express-rate-limit");
const { rateLimit: rateLimitConfig } = require("../config");

const limiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: "error",
      message: "Too many requests from this IP, please try again later.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000), // tiempo en segundos
    });
  },
});

module.exports = limiter;
