const rateLimit = require("express-rate-limit");
const ApiError = require("../api-error");

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeader: false,
  handler: (req, res, next) => {
    return next(new ApiError(429, "Too many requests"));
  },
});

module.exports = apiLimiter;
