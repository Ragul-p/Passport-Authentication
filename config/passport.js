const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");


module.exports = function (passport) {

    passport.use(
        new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {

            // Match User
            const user = await User.findOne({ email: email });
            if (!user) { return done(null, false, { message: 'That email is not registered' }) }

            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) { return done(null, user); }
                else { return done(null, false, { message: 'Password incorrect' }) }
            });
        })
    );


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        if (user) { done(null, user); }
    });


}