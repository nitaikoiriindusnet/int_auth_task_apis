const express = require("express");
const UserRoute = express.Router();
const {
  signupUsers,
  signInUsers,
  verifyOtpSignIn,
  resetPasswordUsers,
  verifyOtpAndResetPassword,
} = require("../controller/usercontroller");
const {
  loginOtpVerify,
  resetPasswordOtpVerify,
} = require("../middleware/auth");
UserRoute.post("/signup", signupUsers);
UserRoute.post("/signin", signInUsers);
UserRoute.post("/verifyotpsignin", loginOtpVerify, verifyOtpSignIn);
UserRoute.post("/resetpassword", resetPasswordUsers);
UserRoute.post(
  "/verifyotpresetpassword",
  resetPasswordOtpVerify,
  verifyOtpAndResetPassword
);
module.exports = UserRoute;
