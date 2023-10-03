const userModel = require("../model/userSchema");
const emailValidator = require("email-validator")
const bcrypt = require('bcrypt')

// For signup

const register = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Every field is required'
        })
    }

    const validEmail = emailValidator.validate(email);

    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email id.'
        })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password and confirm password doesnot match'
        })
    }

    try {
        const userInfo = userModel(req.body);
        const result = await userInfo.save();
        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (e) {
        if (e.code === 11000) { // '11000' is the code of duplicate entry.
            return res.status(400).json({
                success: false,
                data: 'Account already exist with provided email id'
            })
        }
        return res.status(400).json({
            success: false,
            data: e.message
        })
    }
}


// For sign in
const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Every field is required'
        })
    }


    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user || !await bcrypt.compare(password,user.password)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID or Password'
            })
        }

        const token = user.jwtToken();
        user.password = undefined;

        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        };
        res.cookie("token", token, cookieOption);
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

//getUser method

const getUser = async(req,res,next) =>{
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success:true,
            data:user
        })
    } catch (e) {
        return res.status(400).json({
            success:false,
            message: e.message
        })
    }
}


// Log out method

const logout = (req,res,next) =>{
    try {
        const cookieOption = {
            expires:new Date(),
            httpOnly:true
        };
        res.cookie('token',null,cookieOption);
        res.status(200).json({
            success:true,
            message:'Logged Out'
        })
    } catch (err) {
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}



module.exports = {
    register,
    signin,
    getUser,
    logout
}