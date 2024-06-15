// import necessary dependencies
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // google client id
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // google client secret
      // the callback url added while creating the Google auth app on the console
      callbackURL: "http://localhost:4000/auth/google/callback", 
      passReqToCallback: true,
    },

    // returns the authenticated email profile
    async function (req, accessToken, refreshToken, profile, done) {
      const email = profile["emails"][0].value;
      let user = await User.findOne({ email: email });

      if (!user) {
          user = await User.create({
              email: email,
              fullName: profile["displayName"],
              avatar: profile["photos"][0].value,
              username: profile["name"]["givenName"],
              googleId: profile.id,
              googleToken: accessToken,
              verified: true,
              password: 'default',
              name: profile["name"]["givenName"], 
          });
      } else {
          // Si l'utilisateur existe déjà, mettez à jour son ID et son token Google
          user.googleId = profile.id;
          user.googleToken = accessToken;
          await user.save();
      }
      req.user = user;
      done(null, user); 
    } 
  ) 
);

// function to serialize a user/profile object into the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

// function to deserialize a user/profile object into the session
passport.deserializeUser(function (user, done) {
  done(null, user);
});