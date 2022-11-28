const userService = require("../service/userService");
const bcrypt = require("bcrypt");
const joi = require("@hapi/joi");
var jwt = require("jsonwebtoken");
const otpHlp = require("../helper/otp");
const otpservice = require("../service/otpService");
const mailer = require("../helper/mailer");

const signupUsers = async (req, res) => {
  /*Validate Step 1 */
  const vaidateObj = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(16).required(),
  });
  const validateStatus = vaidateObj.validate(req.body);
  if (validateStatus.error) {
    res.status(400).send({
      status: false,
      data: [],
      msg: validateStatus.error.details[0].message,
    });
  } else {
    /*Operation Step 2 */
    const exist = await userService.verifyuseremail(req.body.email);
    if (exist > 0)
      return res
        .status(400)
        .send({ status: false, data: [], msg: "email already exit" });
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    await userService.signupuser({
      name: req.body.name,
      email: req.body.email,
      password: password,
    });
    res.status(200).send({ status: true, data: [], msg: "Success" });
  }
};

const signInUsers = async (req, res) => {
  /*Validate Step 1 */
  const vaidateObj = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  const validateStatus = vaidateObj.validate(req.body);
  if (validateStatus.error) {
    res.status(400).send({
      status: false,
      data: [],
      msg: validateStatus.error.details[0].message,
    });
  } else {
    /*Operation Step 2 */
    const exist = await userService.verifyuseremail(req.body.email);
    if (exist == 0) {
      return res
        .status(400)
        .send({ status: false, data: [], msg: "email or password wrong !" });
    } else {
      const pass = await userService.verifyuserpassword(req.body.email);

      const passStatus = await bcrypt.compare(req.body.password, pass.password);
      console.log(passStatus);
      if (passStatus) {
        const otp = await otpHlp.genOtp();
        const salt = await bcrypt.genSalt(10);
        const hashOtp = await bcrypt.hash(otp.toString(), salt);
        await otpservice.destroyAllOtp(req.body.email);
        await otpservice.saveOtp(req.body.email, hashOtp);
        await mailer.sendMail(
          req.body.email,
          "LOGIN_OTP",
          "Your Secret Otp Code " + otp
        );
        const token = await jwt.sign(
          { email: req.body.email },
          process.env.OTP_SECRET_KEY
        );

        res.status(200).send({
          status: true,
          data: { verify_token: token },
          msg: "success",
        });
      } else {
        return res
          .status(400)
          .send({ status: false, data: [], msg: "email or password wrong !" });
      }
    }
  }
};

const verifyOtpSignIn = async (req, res) => {
  /*Validate Step 1 */
  const vaidateObj = joi.object({
    otp: joi.number().min(6).required(),
  });
  const validateStatus = vaidateObj.validate(req.body);
  if (validateStatus.error) {
    res.status(400).send({
      status: false,
      data: [],
      msg: validateStatus.error.details[0].message,
    });
  } else {
    /*Operation Step 2 */
    const otp = await otpservice.getOtp(req.headers.email);
    if (!otp) {
      return res
        .status(400)
        .send({ status: false, data: [], msg: "invalid request !" });
    } else {
      const hashOtpCmp = await bcrypt.compare(req.body.otp.toString(), otp.otp);
      console.log(hashOtpCmp);
      if (hashOtpCmp) {
        const access_token = await jwt.sign(
          { email: req.headers.email },
          process.env.ACCESS_SECRET_KEY
        );

        const refresh_token = await jwt.sign(
          { email: req.headers.email },
          process.env.REFRESH_SECRET_KEY
        );
        await otpservice.destroyAllOtp(req.headers.email);
        res.status(200).send({
          status: true,
          data: { access_token: access_token, refresh_token: refresh_token },
          msg: "success",
        });
      } else {
        return res
          .status(400)
          .send({ status: false, data: [], msg: "invalid otp !" });
      }
    }
  }
};

const resetPasswordUsers = async (req, res) => {
  /*Validate Step 1 */
  const vaidateObj = joi.object({
    email: joi.string().email().required(),
  });
  const validateStatus = vaidateObj.validate(req.body);
  if (validateStatus.error) {
    res.status(400).send({
      status: false,
      data: [],
      msg: validateStatus.error.details[0].message,
    });
  } else {
    /*Operation Step 2 */
    const exist = await userService.verifyuseremail(req.body.email);
    if (exist == 0) {
      return res
        .status(400)
        .send({ status: false, data: [], msg: "email not found !" });
    } else {
      const otp = await otpHlp.genOtp();
      const salt = await bcrypt.genSalt(10);
      const hashOtp = await bcrypt.hash(otp.toString(), salt);
      await otpservice.destroyAllOtp(req.body.email);
      await otpservice.saveOtp(req.body.email, hashOtp);
      await mailer.sendMail(
        req.body.email,
        "PASSWORD_RESET_OTP",
        "Your Secret Otp Code " + otp
      );
      const token = await jwt.sign(
        { email: req.body.email },
        process.env.RESET_OTP_SECRET_KEY
      );

      res.status(200).send({
        status: true,
        data: { verify_token: token },
        msg: "success",
      });
    }
  }
};

const verifyOtpAndResetPassword = async (req, res) => {
  /*Validate Step 1 */
  const vaidateObj = joi.object({
    otp: joi.number().min(6).required(),
    new_password: joi.number().min(6).required(),
  });
  const validateStatus = vaidateObj.validate(req.body);
  if (validateStatus.error) {
    res.status(400).send({
      status: false,
      data: [],
      msg: validateStatus.error.details[0].message,
    });
  } else {
    /*Operation Step 2 */
    const otp = await otpservice.getOtp(req.headers.email);
    if (!otp) {
      return res
        .status(400)
        .send({ status: false, data: [], msg: "invalid request !" });
    } else {
      const hashOtpCmp = await bcrypt.compare(req.body.otp.toString(), otp.otp);
      console.log(hashOtpCmp);
      if (hashOtpCmp) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.new_password, salt);
        await userService.resetuserpassword(req.headers.email, password);
        await otpservice.destroyAllOtp(req.headers.email);
        res.status(200).send({
          status: true,
          data: {},
          msg: "success",
        });
      } else {
        return res
          .status(400)
          .send({ status: false, data: [], msg: "invalid otp !" });
      }
    }
  }
};

module.exports = {
  signupUsers,
  signInUsers,
  verifyOtpSignIn,
  resetPasswordUsers,
  verifyOtpAndResetPassword,
};
