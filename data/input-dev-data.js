const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Movie = require("./../Models/movieModel");

dotenv.config({ path: "./config.env" });
const DB = process.env.CONN_STR;

//connect to mongoose
mongoose
  .connect(DB)
  .then((conn) => {
    // console.log(conn);
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("DB connection error is occured");
  });

//Read movies.json file, this will get all data in movies.json file
const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

//To delete existing data in DB
const deleteMoviesInDB = async () => {
  try {
    await Movie.deleteMany(); //this method will delete all data as we have not pass argm in deleteMany();
    console.log("DB Data deleted successfully");
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

//import Movies Data to MongoDB collection
const importMoviesToDB = async () => {
  try {
    await Movie.create(movies);
    console.log("Data Impoerted successfully");
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importMoviesToDB();
}

if (process.argv[2] === "--delete") {
  deleteMoviesInDB();
}
