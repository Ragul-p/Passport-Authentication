const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/login", (req, res) => { return res.render("login") });
router.get("/register", (req, res) => { return res.render("register") });

router.post("/register", async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: "Passwords do not match" });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters" });
    }


    if (errors.length > 0) {
        res.render("register", { errors, name, email, password, password2 });
    } else {
        // Validation passed
        const oldUser = await User.findOne({ email: email });
        errors.push({ msg: "Email is already registered" });

        if (oldUser) {
            res.render("register", { errors, name, email, password, password2 });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const newUser = await new User({ name, email, password: hash }).save();
            if (newUser) {
                req.flash("success_msg", "You are now registered and can log in");
                res.redirect("/users/login");
            } else {
                console.log("no user created");
            }
        }
    }

});


// Login Handle 
router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);

});


// Logout
router.get("/logout", (req, res) => {
    req.logout(() => {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
});



module.exports = router;