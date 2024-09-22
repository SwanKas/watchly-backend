import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

let websiteUrl;
if (process.env.ENVIRONMENT === "PROD") {
    websiteUrl = process.env.WEBSITE_URL_PROD;
} else if (process.env.ENVIRONMENT === "DEV") {
    websiteUrl = process.env.WEBSITE_URL_DEV;
} else {
    websiteUrl = process.env.WEBSITE_URL_DEFAULT;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://www.watchly.ovh/api/auth/google/callback",
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email: email });

      if (!user) {
        user = await User.create({
          email: email,
          fullName: profile.displayName,
          avatar: profile.photos[0].value,
          username: profile.name.givenName,
          googleId: profile.id,
          googleToken: accessToken,
          verified: true,
          password: 'default',
          name: profile.name.givenName,
        });
      } else {
        user.googleId = profile.id;
        user.googleToken = accessToken;
        await user.save();
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});