const validator = require("validator");

const validateEmployee = (params) => {
  let docket =
    !validator.isEmpty(params.docket) && validator.isNumeric(params.docket);

  let name =
    !validator.isEmpty(params.name) &&
    validator.isLength(params.name, { min: 2, max: undefined });

  let lastname =
    !validator.isEmpty(params.lastname) &&
    validator.isLength(params.lastname, { min: 3, max: undefined });

  if (!docket || !name || !lastname) {
    throw new Error("Validation failed");
  }
};

module.exports = validateEmployee;
