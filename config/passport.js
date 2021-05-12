const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const account = require('../repository/account')
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new GoogleStrategy({
    clientID: "1084168771108-g34ei1gr4cbpnmjplmv9e3e442hg9t5n.apps.googleusercontent.com",
    clientSecret: "74JjkldA-dOSXlsaURDUgIim",
    callbackURL: "http:localhost:8080/login/google/callback",
}, async(accessToken, refreshToken, profile, done) => {
    if (profile._json.email.includes("@student.tdtu.edu.vn")){
        var user = JSON.parse(await account.saveNewStudent(profile._json))
        done(null, user.data)
    }else{
        done(null, false, { message: "Vui lòng sử dụng mail sinh viên" })
    }

}))

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, async(req, username, password, done) => {
    if (username && password) {
        var check = await account.checkAccount(username, password)
        var data = JSON.parse(check)
        if (data.code === 0) {
            done(null, data.data)
        } else {
            req.flash("error", "Sai tên đăng nhập hoặc mật khẩu")
            done(null, false)
        }
    } else {
        req.flash("error", "Please enter username or password")
        done(null, false)
    }
}));