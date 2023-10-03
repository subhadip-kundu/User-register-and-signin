const express = require('express');
const { register, signin, getUser, logout } = require('../controller/authcontroller');
const{JWTauth} = require('../middleware/jwtAuth.js')

const authRouter = express.Router();

authRouter.post('/signup', register)
authRouter.post('/signin', signin)
authRouter.get('/user',JWTauth, getUser)
authRouter.get('/logout',JWTauth, logout)

module.exports = authRouter;