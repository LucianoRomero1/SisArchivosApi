const validator = require("validator");
const moment = require("moment");

const validateFolder = (params) => {
  let folderNumber =
    !validator.isEmpty(params.folderNumber) &&
    validator.isNumeric(params.folderNumber);

  let title =
    !validator.isEmpty(params.title) &&
    validator.isLength(params.title, { min: 4, max: undefined });

  let dateTo = !validator.isEmpty(params.dateTo);
  let dateMoment = moment(params.dateTo, "DD/MM/YYYY");

  let boxId =
    !validator.isEmpty(params.boxId) && validator.isNumeric(params.boxId);
  let stateId =
    !validator.isEmpty(params.stateId) && validator.isNumeric(params.stateId);

  if (!folderNumber || !dateTo || !dateMoment.isValid() || !title || !boxId || !stateId) {
    throw new Error("Validation failed");
  }
};

module.exports = validateFolder;
