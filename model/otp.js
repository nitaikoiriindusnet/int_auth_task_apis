module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define("otps", {
    email_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    current_status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  return Otp;
};
