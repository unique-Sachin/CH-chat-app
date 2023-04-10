const notFoundMiddleware = (req, res, next) => {
  res.status(400).send(`Not Found- ${req.originalUrl}`);
};
module.exports = notFoundMiddleware;
