const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const passportConfig = (passport) => {
  passport.use(new LocalStrategy(User.authenticate()));
};

module.exports = passportConfig;
