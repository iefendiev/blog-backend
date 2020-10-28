const express = require('express');

const authController = require('../controllers/authController');

const Router = express.Router();

Router.route('/login').post(authController.authenticate);
Router.route('/register').post(authController.register);
Router.route('/password-recovery').post(authController.passwordRecovery);

module.exports = Router;
