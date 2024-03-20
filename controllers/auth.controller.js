import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import UserToken from "../models/UserToken.js";
import nodemailer from "nodemailer";

export const register = async (req, res, next) => {
    try {
        const role = await Role.find({role:'User'});
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: hashPassword,
            roles: role
        });
        await newUser.save();
        return next(CreateSuccess(200, "User registered successfully!"));    
    } catch (error) {
        return next(CreateError());
    }
}

export const registerAdmin = async (req, res, next) => {
    try {
        const role = await Role.find({});
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: hashPassword,
            isAdmin: true,
            roles: role
        });
        await newUser.save();
        return next(CreateSuccess(200, "Admin registered successfully!"));    
    } catch (error) {
        return next(CreateError());
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email}); //.populate("roles","role");
        // const { roles } = user;
        if(!user) {
            return next(CreateError(400,"User not found!"));
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect) {
            return next(CreateError(400,"Password is incorrect!"));
        }

        // const token = jwt.sign({id: user._id, isAdmin: user.isAdmin, roles: user.roles}, process.env.JWT_SECRET);
        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
        res.cookie("access_token", token, {httpOnly:true})
        .status(200)
        .json({status: 200, message: "Login success!", data: user});
    } catch (error) {
        return next(CreateError());
    }
}

export const sendEmail = async (req, res, next) => {
    // try {
        const email = req.body.email;
        const user = await User.findOne({email: {$regex: `^${email}$`}});
        if(!user)  {
            return next(CreateError(404, "User not found!"));
        }
        const payload = { email: user.email };
        const expiryTime = 300;
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: expiryTime});

        const newToken = new UserToken({userId: user._id, token: token});

        const mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:"vineetkuma@gmail.com",
                pass:"jgicrqycshgffmjy"
            }
        });

        const mailDetails = {
            from: "vineetkuma@gmail.com",
            to: email,
            subject: "Reset Password",
            html: `
            <html>
            <head><title>Password Reset Request</title></head>
            <body>
            <h1>Password Reset Request</h1>
            <p>Dear ${user.userName},</p>
            <p>We have recieved a request to reset your password for your account with MyApp. To complete the password reset process, please click on the button below:</p>
            <a href=${process.env.LIVE_URL}/reset/${token}><button style="background-color:#4CAF50; color: white; padding: 14px 20px; border:none; cursor: pointer; border-radius: 4px;">Reset Pasword</button></a>
            <p>Please note that this link is only valid for 5 mins. If you did not request a pasword reset, please disregard this message.</p>
            <p>Thank you,</p>
            <p>MyApp Team</p>
            </body>
            </html>
            `
        }

        mailTransporter.sendMail(mailDetails, async (err, data) => {
            if(err) {
                console.log(err);
                return next(CreateError(500, "Something went wrong while sending the email"));
            } else {
                await newToken.save();
                return next(CreateSuccess(200, "Email sent successfully!"));
            }
        });
    // } catch (error) {
    //     return next(CreateError());
    // }

}

export const resetPassword = (req, res, next) => {
    try {
        const token =  req.body.token;
        const newPassword = req.body.password;

        jwt.verify(token, process.env.JWT_SECRET, async (err, data) =>  {
            if(err) {
                return next(CreateError(500, "Reset Link is expired!"));
            } else {
                const response = data;
                const user = await User.findOne({email: {$regex: `^${response.email}$`}});
                const salt = await bcrypt.genSalt(10);
                const encryptedPassword = await bcrypt.hash(newPassword, salt);
                user.password = encryptedPassword;
                try {
                    const updatedUser = await User.findOneAndUpdate({_id: user.id}, {$set: user}, {new: true});
                    return next(CreateSuccess(200, "Password reset successfully!"));
                } catch (error) {
                    return next(CreateError(500, "Something went wrong while resetting the password!"));
                }
            }
        });
    } catch (error) {
        return next(CreateError());
    }
}


















