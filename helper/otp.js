module.exports.genOtp = () => {
  return new Promise((resolve, reject) => {
    const x =
      Math.floor(
        Math.random() *
          (parseFloat(process.env.OTP_TO_RANGE) -
            parseFloat(process.env.OTP_FROM_RANGE)) +
          1
      ) + parseFloat(process.env.OTP_FROM_RANGE);
    resolve(x);
  });
};
