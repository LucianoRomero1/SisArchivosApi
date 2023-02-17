//Services
const validateBox = require("../helpers/validateBox");
const moment = require("moment");

//Models
const db = require("../models/index");
const Box = db.Box;

//Endpoints
const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Message sended from box controller",
  });
};

const create = async (req, res) => {
  let params = req.body;

  if (!params.dateTo || !params.title || !params.areaId || !params.sideId || !params.stateId) {
    return res.status(400).send({
      status: "error",
      message: "Missing parameters",
    });
  }

  try {
    validateBox(params);
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Invalid parameters",
    });
  }

  const BoxExist = await Box.findOne({
    where: {
      title: params.title,
    },
  });

  if (BoxExist) {
    return res.status(200).send({
      status: "success",
      message: "There is already a box with that name",
    });
  }

  try {
    let dateMoment = moment(params.dateTo, "DD/MM/YYYY");
    let boxToSave = await Box.create({
      title: params.title,
      boxNumber: params.boxNumber,
      dateFrom: moment(),
      dateTo: dateMoment.toDate(),
      areaId: params.areaId,
      sideId: params.sideId,
      stateId: params.stateId,
      column: params.column,
      floor: params.floor,
      numberFrom: params.numberFrom,
      numberTo: params.numberTo,
      observation: params.observation,
    });

    return res.status(200).json({
      status: "success",
      message: "Successfully registered box",
      box: boxToSave,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error saving box " + error,
    });
  }
};

module.exports = {
  test,
  create,
};
