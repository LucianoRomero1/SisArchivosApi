//Dependencies
const { Op } = require("sequelize");

//Services
const general = require("../services/general");
const moment = require("moment");
const validateMovement = require("../helpers/validateMovement");

//Models
const db = require("../models/index");
const Movement = db.Movement;

const create = async (req, res) => {
  let params = req.body;
  if (!params.withdrawalDate || !params.folderId || !params.employeeId) {
    return res.status(400).send({
      status: "error",
      message: "Missing parameters",
    });
  }

  try {
    validateMovement(params);
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Invalid parameters",
    });
  }

  try {
    let dateMoment = moment(params.withdrawalDate, "DD/MM/YYYY");
    let newMovement = await Movement.create({
      withdrawalDate: dateMoment.toDate(),
      folderId: params.folderId,
      employeeId: params.employeeId,
      stateId: 5,
    });
    return res.status(200).send({
      status: "success",
      message: "Movement created successfully",
      movement: newMovement,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error saving movement " + error,
    });
  }
};

const list = async (req, res) => {
  try {
    const data = await general.list(req, res, Movement);
    return res.status(200).send({
      status: "success",
      data: data,
      totalPages: Math.ceil(data.count / data.size),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error listing movements " + error,
    });
  }
};

const detail = async (req, res) => {
  let id = req.params.id;

  const movementDetail = await Movement.findOne({
    where: {
      id: id,
    },
  });

  if (!movementDetail) {
    return res.status(404).send({
      status: "error",
      message: "Movement does not exist",
    });
  }

  return res.status(200).send({
    status: "success",
    data: movementDetail,
  });
};

const update = async (req, res) => {
  let id = req.params.id;

  const movementFinded = await Movement.findOne({
    where: {
      id: id,
    },
  });

  if (!movementFinded) {
    return res.status(404).send({
      status: "error",
      message: "Movement does not exist",
    });
  }

  try {
    let params = req.body;
    if (!params.returnDate) {
      return res.status(400).send({
        status: "error",
        message: "Missing parameters",
      });
    }

    try {
      validateMovement(params);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Invalid parameters",
      });
    }

    let dateMoment = moment(params.returnDate, "DD/MM/YYYY");
    await Movement.update(
      {
        returnDate: dateMoment.toDate(),
        stateId: 4,
      },
      {
        where: {
          id: id,
        },
      }
    );

    await movementFinded.reload();

    return res.status(200).send({
      status: "success",
      data: movementFinded,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to update movement " + error,
    });
  }
};

const remove = async (req, res) => {
  let id = req.params.id;

  const movementToRemove = await Movement.findOne({
    where: {
      id: id,
    },
  });

  if (!movementToRemove) {
    return res.status(404).send({
      status: "error",
      message: "Movement does not exist",
    });
  }

  try {
    await movementToRemove.destroy();

    return res.status(200).send({
      status: "success",
      message: "The movement was deleted succesfully",
      data: movementToRemove,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to delete movement " + error,
    });
  }
};

module.exports = {
  create,
  list,
  detail,
  update,
  remove,
};
