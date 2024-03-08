const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require('crypto');


// Index page
router.get("/", (req, res) => {
    res.send("login/signup page");
});

// Successfull signup route
router.get("/successfullsignup", (req, res) => {
    res.render("successfullsignup.ejs");
});

// Signup get Route
router.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

// Signup post Route
router.post("/signup", async (req, res) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        console.log("New user registered successfully");
        res.redirect("successfullsignup");
    } catch (error) {
        console.log(error);
        res.redirect("/signup");
    }
});

// Login get route
router.get("/login", (req, res) => {
    res.render("login.ejs");
});

// Successfull signup route
router.get("/failed", (req, res) => {
    res.render("failed.ejs");
});

// Login post route
router.post("/login", passport.authenticate('local', { failureRedirect: "/failed" }), async (req, res) => {
    try {
        console.log("You logged in successfully");
        res.send("Logged in successfully");
    } catch (error) {
        console.log(error);
        res.render("failed.ejs");
    }
});

// Forgot password get route
router.get("/forgot", (req, res) => {
    res.render("forgot.ejs");
});

// Forgot password post route
router.post("/forgot", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {  
            return res.render("forgot.ejs", { error: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; 
        await user.save();

        // Send reset email
        sendResetEmail(email, resetToken);

        res.render("forgot-success.ejs");
    } catch (error) {
        console.error(error);
        res.render("forgot.ejs", { error: "Something went wrong" });
    }
});


function sendResetEmail(email, resetToken) {
  
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'zuhairkhan5134@gmail.com', // Your Gmail email address
            pass: 'ptwu ymgy huap brti' // Your Gmail password
        }
    });

    const mailOptions = {
        from: 'zuhairkhan5134@gmail.com', // Your Gmail email address
        to: 'zuhairk7890o@gmail.com',
        subject: 'Password Reset',
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste it into your browser to complete the process:\n\n` +
        `http://yourwebsite.com/reset/${resetToken}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
            console.log("password reset Successful")
        }
    });
}

module.exports = router;
