import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request } from "express";
import UserModel from "../Models/user.model";

const serverUrl = process.env.SERVER_URL || "";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? `${serverUrl}/api/v1/auth/google/callback`
          : "http://localhost:5500/api/v1/auth/google/callback",
    },
    async (_, __, profile, cb) => {
      const email = profile.emails ? profile.emails?.[0].value : "";
      const image = profile.photos ? profile.photos[0].value : "";
      try {
        let user = await UserModel.findOne({
          email,
        });
        if (!user) {
          user = await UserModel.create({
            name: profile.displayName,
            image: image,
            email: email,
            emailVerified: true,
          });
        } else {
          if (!user.emailVerified) {
            user.emailVerified = true;
            await user.save();
          }
        }

        return cb(null, user);
      } catch (error) {
        console.log(error);
        return cb(error, undefined);
      }
    },
  ),
);

export default passport;
