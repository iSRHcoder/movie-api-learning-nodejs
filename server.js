const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
// require("dotenv").config();

const app = require("./app");
const DB = process.env.CONN_STR;

mongoose
  .connect(DB)
  .then((conn) => {
    // console.log(conn);
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("DB connection error is occured");
  });

//create a server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server has been started on port:", port);
  console.log("Env:", process.env.NODE_ENV_MODE);
});
