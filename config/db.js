const mongoose = require("mongoose");
const config = require("./config.js");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose
      .connect(config.MONGODB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then((conn) => {
        console.log(`MongoDB connected: ${conn.connection.host}`);
      });
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
