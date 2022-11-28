const express = require("express");
const Router = express.Router();
const UserRoute = require("./userRouter");
Router.use("/user", UserRoute);
module.exports = Router;
