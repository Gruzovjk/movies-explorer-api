const rateLimit = require('express-rate-limit');

function requestsLimiter(req, res, next) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Слишком много запросов с этого IP, попробуйте позже',
  });
  limiter(req, res, next);
}

module.exports = requestsLimiter;
