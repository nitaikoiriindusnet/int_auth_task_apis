const Otp = require("../model").Otp;
const saveOtp = (email, otp) => {
  return new Promise(async (resolve, reject) => {
    await Otp.create({
      email_id: email,
      otp: otp,
    });
    resolve(true);
  });
};

const destroyAllOtp = (email) => {
  return new Promise(async (resolve, reject) => {
    await Otp.update({ current_status: 1 }, { where: { email_id: email } });
    resolve(true);
  });
};

const getOtp = (email) => {
  return new Promise(async (resolve, reject) => {
    const x = await Otp.findOne({
      attributes: ["otp"],
      where: { email_id: email, current_status: 0 },
    });
    resolve(x);
  });
};

module.exports = {
  saveOtp,
  destroyAllOtp,
  getOtp,
};
