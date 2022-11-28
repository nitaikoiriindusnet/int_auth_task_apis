const User = require("../model").User;

const signupuser = async (data) => {
  const x = await User.create(data);
  return x;
};

const verifyuseremail = async (email) => {
  const { count } = await User.findAndCountAll({
    attribute: [],
    where: { email: email },
  });
  return count;
};

const verifyuserpassword = async (email) => {
  return new Promise(async (resolve, reject) => {
    const x = await User.findOne({
      attributes: ["password"],
      where: { email: email },
    });
    resolve(x);
  });
};

const resetuserpassword = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    await User.update(
      { password: password },
      {
        where: { email: email },
      }
    );
    resolve(true);
  });
};

module.exports = {
  signupuser,
  verifyuseremail,
  verifyuserpassword,
  resetuserpassword,
};
