const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new GoogleStrategy({
    clientID: "1084168771108-g34ei1gr4cbpnmjplmv9e3e442hg9t5n.apps.googleusercontent.com",
    clientSecret: "74JjkldA-dOSXlsaURDUgIim",
    callbackURL: "http://localhost:8080/account/google/callback"
},function(accessToken, refreshToken, profile, cb){
    cb(null, profile)
}))