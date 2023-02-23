const validator = require("validator");
const moment = require("moment");

const validateMovement = (params) => {
  if (params.withdrawalDate) {
    let withdrawalDate = !validator.isEmpty(params.withdrawalDate);
    let withdrawalDateMoment = moment(params.withdrawalDate, "DD/MM/YYYY");
    if (!withdrawalDate || !withdrawalDateMoment.isValid()) {
      throw new Error("Validation failed");
    }
  }

  if (params.returnDate) {
    let returnDate = !validator.isEmpty(params.returnDate);
    let returnDateMoment = moment(params.returnDate, "DD/MM/YYYY");
    if (!returnDate || !returnDateMoment.isValid()) {
      throw new Error("Validation failed");
    }
  }

  if (params.employeeId) {
    let employeeId =
      !validator.isEmpty(params.employeeId) &&
      validator.isNumeric(params.employeeId);
    if (!employeeId) {
      throw new Error("Validation failed");
    }
  }

  if (params.folderId) {
    let folderId =
      !validator.isEmpty(params.folderId) &&
      validator.isNumeric(params.folderId);
    if (!folderId) {
      throw new Error("Validation failed");
    }
  }

};

module.exports = validateMovement;
