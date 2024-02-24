const express = require("express");

const morgan = require("morgan");
const moviesRouter = require("./Routes/moviesRoutes");
const CustomError = require("./Utils/CustomError");
const { globalErrHandler } = require("./Controllers/errorController");
const app = express();

const logger = (req, res, next) => {
  next();
};

app.use(express.json());

if (process.env.NODE_ENV_MODE === "development") {
  app.use(morgan("dev"));
}

app.use(express.static("./public"));
app.use(logger);
app.use((req, res, next) => {
  req.requestedAt = new Date().toLocaleString();
  next();
});

//Using the routes
app.use("/api/v1/movies", moviesRouter);
/* to handle the wrong url we handle it like this */
app.all("*", (req, res, next) => {
  /* res.status(404).json({
    status: "Failed",
    message: `oops..! can't find ${req.originalUrl} on server, please provide valid url`,
  }); */
  // const err = new Error(
  //   `oops..! can't find ${req.originalUrl} on server, please provide valid url`
  // );
  // (err.status = "fail"),
  //   (err.statusCode = 404),

  const err = new CustomError(
    `oops..! can't find ${req.originalUrl} on server, please provide valid url`,
    404
  );
  next(err);

  /*any argm passed to this next func/middleware it will call err 
  handling middleware */
});

/* global error handling, express will call this middleware only when there is error */
app.use(globalErrHandler);

module.exports = app;
