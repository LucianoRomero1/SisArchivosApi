//Dependencies
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

//Services
const jwt = require("../services/jwt");

//Models
const db = require("../models/index");
const Area = db.Area;

//Endpoints
const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Message sended from area controller",
  });
};

const create = async (req, res) => {
  const params = req.body;

  if (!params.name) {
    return res.status(400).send({
      status: "error",
      message: "The name of Area is required",
    });
  }

  const AreaExist = await Area.findOne({
    where: {
      name: params.name,
    },
  });

  if (AreaExist) {
    return res.status(200).send({
      status: "success",
      message: "The area " + AreaExist.name + " already exist",
    });
  }

  try {
    let NewArea = await Area.create(params);
    return res.status(200).send({
      status: "success",
      message: "Area created successfully",
      area: NewArea,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error saving area " + error,
    });
  }
};

const list = async (req, res) => {};

const detail = async (req, res) => {};

const update = async (req, res) => {};

const remove = async (req, res) => {};

module.exports = {
  test,
  create,
  list,
  detail,
  update,
  remove,
};
