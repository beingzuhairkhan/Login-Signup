const express = require("express");
const app = express();
const PORT = 8080;
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/Task1";
const User = require("./model/user.js");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./routes/user.js");
const session = require("express-session"); 

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOption = {
    
    secret: 'zuhair',
    resave: false,
    saveUninitialized: true,
    
};

app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use("/", user);

app.listen(PORT, () => {
    console.log(`App is working on port ${PORT}`);
});
