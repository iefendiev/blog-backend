require("dotenv").config();

const config = {
  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
  SECRET: process.env.SECRET,
  GMAIL_USERNAME: process.env.GMAIL_USERNAME || "test@gmail.com",
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || "test_password",
  PORT: process.env.PORT || 8080,
};

module.exports = config;
