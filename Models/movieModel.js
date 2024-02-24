const mongoose = require("mongoose");
const fs = require("fs");
const validator = require("validator");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required field"],
      unique: true,
      maxlength: [100, "Movie title must not have more than 100 Characters"],
      minlength: [3, "Movie title must have atLeast 3 Characters"],
      trim: true,
      /* validate: [validator.isAlpha, "Name should contain only Alphabates"], //this validator library is just to take trial of
       its one property isAlpha*/
    },
    description: {
      type: String,
      required: [true, "Description is required field"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required field"],
      trim: true,
    },
    rating: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 1 && value <= 5;
        },
        message: "Rating ({VALUE}) should be above 1 and below 5",
      },
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // this select:false will hide this createdAt field from user
    },
    releaseYear: {
      type: Number,
      required: [true, "ReleaseYear is required field"],
      trim: true,
    },
    genres: {
      type: [String],
      required: [true, "Genres is required field"],
    },
    directors: {
      type: [String],
      required: [true, "Directors is required field"],
    },
    coverImage: {
      type: [String],
      required: [true, "CoverImage is required field"],
      // enum: { // enum is validator used on string type only and used to validate like this
      //   values: [
      //     "Action",
      //     "Adventure",
      //     "Animation",
      //     "Biography",
      //     "Comedy",
      //     "Crime",
      //     "Documentary",
      //     "Drama",
      //     "Family",
      //     "Fantasy",
      //     "Film-Noir",
      //     "History",
      //     "Horror",
      //     "Music",
      //     "Musical",
      //     "Mystery",
      //     "Romance",
      //     "Sci-Fi",
      //     "Sport",
      //     "Thriller",
      //     "War",
      //     "Western",
      //   ],
      //   message: "This Genre does not exist",
      // },
    },
    actors: {
      type: [String],
      required: [true, "Actors is required field"],
    },
    price: {
      type: Number,
      required: [true, "Price is required field"],
    },
    createdBy: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});
//Executed before the document is saved in DB
//.save() or .created()
movieSchema.pre("save", function (next) {
  this.createdBy = "Sunil_Hatkadke";
  next();
});

movieSchema.post("save", function (doc, next) {
  const content = `A new movie document with title ${doc.title} has been created by ${doc.createdBy}\n`;
  fs.writeFileSync("./Log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});

movieSchema.pre(/^find/, function (next) {
  this.find({ releaseYear: { $lte: Date.now() } });
  this.startTime = Date.now();
  next();
});

movieSchema.post(/^find/, function (docs, next) {
  this.find({ releaseYear: { $lte: Date.now() } });
  this.endTime = Date.now();

  const content = `Query took ${
    this.endTime - this.startTime
  } milliseconds to fetch the documents`;
  fs.writeFileSync("./Log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });

  next();
});

movieSchema.pre("aggregate", function (next) {
  console.log(
    this.pipeline().unshift({ $match: { releaseYear: { $lte: new Date() } } })
  );

  next();
});
const Movie = mongoose.model("Movie", movieSchema); //model name should be start with capital letter

module.exports = Movie;
