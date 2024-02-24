const CustomError = require("../Utils/CustomError");

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.path} : ${err.value}!`;
  return new CustomError(msg, 400);
};

const duplicateKeyErrorHandler = (err) => {
  const msg = `Thers is already a movie with name '${err.keyValue.name}'. Please use another name!`;
  return new CustomError(msg, 400);
};

const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMsgs = errors.join(". ");
  const msg = `Invalid input data: ${errorMsgs}`;

  return new CustomError(msg, 400);
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: error.status,
      message: "Something went wrong, Please try again later",
    });
  }
};

exports.globalErrHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500; // internal server error
  error.status = error.status || "error";

  if (process.env.NODE_ENV_MODE === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV_MODE === "production") {
    if (error.name === "CastError") {
      error = castErrorHandler(error);
    }
    if (error.code === 11000) {
      error = duplicateKeyErrorHandler(error);
    }
    if (error.name === "validationError") {
      error = validationErrorHandler(error); // mongoose validation error
    }

    prodErrors(res, error);
  }
};
