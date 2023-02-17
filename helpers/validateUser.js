const validator = require("validator");

const validateUser = (params) => {
  let name =
    !validator.isEmpty(params.name) &&
    validator.isLength(params.name, { min: 3, max: undefined }) &&
    validator.isAlpha(params.name, "es-ES");

  let lastname =
    !validator.isEmpty(params.lastname) &&
    validator.isLength(params.lastname, { min: 3, max: undefined }) &&
    validator.isAlpha(params.lastname, "es-ES");

  let username =
    !validator.isEmpty(params.username) &&
    validator.isLength(params.username, { min: 3, max: undefined });

  let email =
    !validator.isEmpty(params.email) && validator.isEmail(params.email);

  let password = !validator.isEmpty(params.password);

  if (!name || !lastname || !username || !email || !password) {
    throw new Error("Validation failed");
  }
};

module.exports = validateUser;
