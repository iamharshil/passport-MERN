import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import passport from "passport";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's URL
    credentials: true, // Allow cookies to be sent
  })
);

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
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
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
