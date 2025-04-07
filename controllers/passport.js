const USER = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');   

passport.use(new GoogleStrategy({
    clientID: "1010913523499-04sk53vj3jc9fpd4vh0ol6g0eblm6461.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: 'http://localhost:3000/auth/google/callback'
},
async function (accessToken, refreshToken, profile, done){

    console.log(profile);
    
      USER.findOrCreate(
        { googleId: profile.id },
        {
          name: profile.displayName,
          email: profile.emails[0].value,
          password: profile.photos[0].value
        },
        function (err, user) {
          return done(err, user);
        }
        
      );
    }
  )
);

passport.serializeUser(function(user, done) {
    done(null, user);
  });
    
passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });