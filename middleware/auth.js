var jwt = require("jsonwebtoken");
const loginOtpVerify = (req, res, next) => {
  const verify_token = req.headers.verify_token;
  if (verify_token != undefined || verify_token != null) {
    try {
      const data = jwt.verify(verify_token, process.env.OTP_SECRET_KEY);
      req.headers.email = data.email;
      console.log(data);
      next();
    } catch (err) {
      return res
        .status(401)
        .send({ status: false, data: [], msg: "access denied !" });
    }
  } else {
    return res
      .status(401)
      .send({ status: false, data: [], msg: "verify_token required !" });
  }
};

const resetPasswordOtpVerify = (req, res, next) => {
  const verify_token = req.headers.verify_token;
  if (verify_token != undefined || verify_token != null) {
    try {
      const data = jwt.verify(verify_token, process.env.RESET_OTP_SECRET_KEY);
      req.headers.email = data.email;
      console.log(data);
      next();
    } catch (err) {
      return res
        .status(401)
        .send({ status: false, data: [], msg: "access denied !" });
    }
  } else {
    return res
      .status(401)
      .send({ status: false, data: [], msg: "verify_token required !" });
  }
};

module.exports = {
  loginOtpVerify,
  resetPasswordOtpVerify,
};
