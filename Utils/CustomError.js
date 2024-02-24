class CustomError extends Error {
  constructor(errMsg, statusCode) {
    console.log("err msg:", errMsg);
    super(errMsg);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;

/* const error = new CustomError('some errMsg', 404) // this will call the custroctor of CustomError class */
