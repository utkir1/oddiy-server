export const errorHandling = (err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    status: err.status
  })
}
