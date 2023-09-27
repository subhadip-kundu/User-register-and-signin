const express = require('express');
const { register ,signin} = require('../controller/authcontroller');

const authRouter = express.Router();

authRouter.post('/signup',register)
authRouter.post('/signin',signin)

module.exports = authRouter;