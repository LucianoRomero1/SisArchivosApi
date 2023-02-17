const validator = require("validator");
const moment = require("moment");

const validateBox = (params) => {
  let dateTo = !validator.isEmpty(params.dateTo);
  let dateMoment = moment(params.dateTo, "DD/MM/YYYY");

  let title =
    !validator.isEmpty(params.title) &&
    validator.isLength(params.title, { min: 4, max: undefined });

  let state =
    !validator.isEmpty(params.state) && validator.isNumeric(params.state);

  let areaId =
    !validator.isEmpty(params.areaId) && validator.isNumeric(params.areaId);
  let sideId =
    !validator.isEmpty(params.sideId) && validator.isNumeric(params.sideId);

  if (params.boxNumber) {
    let boxNumber =
      !validator.isEmpty(params.boxNumber) &&
      validator.isNumeric(params.boxNumber);
    if (!boxNumber) {
      throw new Error("Validation failed");
    }
  }

  if (params.column) {
    let column =
      !validator.isEmpty(params.column) && validator.isNumeric(params.column);
    if (!column) {
      throw new Error("Validation failed");
    }
  }

  if (params.floor) {
    let floor =
      !validator.isEmpty(params.floor) && validator.isNumeric(params.floor);
    if (!floor) {
      throw new Error("Validation failed");
    }
  }

  if (params.numberFrom) {
    let numberFrom =
      !validator.isEmpty(params.numberFrom) &&
      validator.isNumeric(params.numberFrom);
    if (!numberFrom) {
      throw new Error("Validation failed");
    }
  }

  if (params.numberTo) {
    let numberTo =
      !validator.isEmpty(params.numberTo) &&
      validator.isNumeric(params.numberTo);
    if (!numberTo) {
      throw new Error("Validation failed");
    }
  }

  if (!dateTo || !dateMoment.isValid() || !title || !state || !areaId || !sideId) {
    throw new Error("Validation failed");
  }
};

module.exports = validateBox;
