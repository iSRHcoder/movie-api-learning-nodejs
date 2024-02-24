module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      console.log("err bfr next", err);
      return next(err);
    });
  };
};
