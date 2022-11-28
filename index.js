const express = require("express");
const env = require("dotenv");
env.config();
const app = express();
app.use(express.json());
// Database Initialize
require("./model");

/* Routers Initialize */
const Router = require("./router/router");
app.use("/v1/api/", Router);

app.listen(process.env.PORT, () =>
  console.log("Server Runs On Port " + process.env.PORT)
);
