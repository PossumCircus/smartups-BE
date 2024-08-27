const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const authConfig = require("../config/authConfig");
const User = require("../models/User");

// Passport - Google Strategy Setup
passport.use(
    new GoogleStrategy(
        authConfig.googleAuth,
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find or create a user using Google ID
                const existingUser = await User.findOne({
                    googleId: profile.id,
                });
                if (existingUser) {
                    return done(null, existingUser);
                }

                // Create a new user
                const newUser = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value, // Adjust if needed
                });

                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);

async function handleGoogleLoginOrSignup(req, res, next, user) {
    try {
        const token = auth.generateAuthToken(user._id); // Assuming you have an auth middleware or similar for token generation

        // Success Response - Adapt as needed
        res.status(200).json({
            status: "success",
            token,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
}

// Passport serialization (simplified for this example)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, done));

// Middleware for Authentication
function authenticateGoogle() {
    return passport.authenticate("google", { scope: ["profile", "email"] });
}

module.exports = {
    authenticateGoogle, // Export any functions you want to use in controllers
    passport, // Exporting passport itself is often useful for app setup
    handleGoogleLoginOrSignup,
};
