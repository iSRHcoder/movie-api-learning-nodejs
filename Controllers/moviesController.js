const Movie = require("./../Models/movieModel");
const ApiFeatures = require("./../Utils/ApiFeatures");
const CustomError = require("./../Utils/CustomError");
const asyncErrHandler = require("./../Utils/asyncErrorHandler");

exports.getHighestRated = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-rating";
  next();
};

exports.getAllMovies = asyncErrHandler(async (req, res, next) => {
  const features = new ApiFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let movies = await features.query;

  res.status(200).json({
    status: "success",
    Page: req.query.page || "1",
    Count: movies.length,
    data: {
      movies,
    },
  });
});

exports.getMovie = asyncErrHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    const error = new CustomError("movie with id is not found", 404);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.createMovie = asyncErrHandler(async (req, res, next) => {
  const movie = await Movie.create(req.body);

  next();

  res.status(201).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.updateMovie = asyncErrHandler(async (req, res, next) => {
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedMovie) {
    const error = new CustomError("movie with id is not found", 404);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      movie: updatedMovie,
    },
  });
});

exports.deleteMovie = asyncErrHandler(async (req, res, next) => {
  const deleteMovie = await Movie.findByIdAndDelete(req.params.id);

  if (!deleteMovie) {
    const error = new CustomError("movie with id is not found", 404);
    return next(error);
  }

  res.status(204).json({
    status: "Success",
    data: null,
  });
});

exports.getMovieStats = asyncErrHandler(async (req, res, next) => {
  const stats = await Movie.aggregate([
    { $match: { rating: { $gte: 4.5 } } },
    {
      $group: {
        _id: "$releaseYear",
        avgRating: { $avg: "$ratings" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        totalPrice: { $sum: "$price" },
        movieCount: { $sum: 1 },
      },
    },
    { $sort: { minPrice: 1 } },
    // { $match: { maxPrice: { $gte: 12 } } },
  ]);

  res.status(200).json({
    status: "Success",
    count: stats.length,
    data: {
      stats,
    },
  });
});

exports.getMoviesByGenre = asyncErrHandler(async (req, res, next) => {
  const genre = req.params.genre;
  const movies = await Movie.aggregate([
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        movieCount: { $sum: 1 },
        movies: { $push: "$title" },
      },
    },
    { $addFields: { genre: "$_id" } },
    { $project: { _id: 0 } },
    { $sort: { movieCount: -1 } },
    //{ $limit: 6 },
    { $match: { genre: genre } },
  ]);

  res.status(200).json({
    status: "Success",
    count: movies.length,
    data: {
      movies,
    },
  });
});
