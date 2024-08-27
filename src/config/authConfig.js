// config/authConfig.js
module.exports = {
    googleAuth: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback', 
    }
}
