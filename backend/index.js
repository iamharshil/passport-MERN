import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import passport from "passport";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000/" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

import "./config/passport.js";

app.post("/api/login", (req, res) => {
  const user = { id: 1, username: "test", password: "test" };

  if (
    req.body.username === user.username &&
    req.body.password === user.password
  ) {
    const token = jwt.sign(user, "test", { expiresIn: "1D" });
    console.log(">>> ~ app.post ~ token:", token);

    if (token) {

      res.cookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        maxAge: 30000 * 10000,
        path: "/",
        domain: "localhost",
      });
      return res
        .status(200)
        .json({ success: true, message: "You're logged in successfully." });
    }
    return res
      .status(500)
      .json({ success: false, message: "Error signing token" });
  }
  return res
    .status(401)
    .json({ success: false, message: "Invalid credentials" });
});

app.get(
  "/api/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(">>> ~ app.get ~ req.headers:", req.headers?.authorization);
    return res
      .status(200)
      .json({ success: true, message: "You are authorized" });
  }
);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
