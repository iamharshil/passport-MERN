import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "test";

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(">>> ~ newJwtStrategy ~ jwt_payload:", jwt_payload);
    const user = { id: 1, username: "test", password: "test" };

    if (jwt_payload.username === user.username) {
      return done(null, user);
    }
    return done(null, false);
  })
);
