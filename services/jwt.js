const jwt = require("jwt-simple");
const moment = require("moment");

const secretKey = "secret_k3y_S1sArch1v0s_Lr2912";

const createToken = (user) => {
  console.log(user);
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    password: user.password,
    name: user.name,
    lastname: user.lastname,
    iat: moment().unix,
    exp: moment().add(30, "days").unix(),
  };

  return jwt.encode(payload, secretKey);
};

module.exports = {
  secretKey,
  createToken,
};
