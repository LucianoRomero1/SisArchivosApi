//Dependencies
const { Op } = require("sequelize");

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

  if (
    !params.dateTo ||
    !params.title ||
    !params.areaId ||
    !params.sideId ||
    !params.stateId
  ) {
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

  const boxExist = await Box.findOne({
    where: {
      title: params.title,
    },
  });

  if (boxExist) {
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

const list = async (req, res) => {
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  let size = 10;
  if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
    size = sizeAsNumber;
  }

  const boxes = await Box.findAndCountAll({
    order: [["createdAt", "DESC"]],
    limit: size,
    offset: page * size,
  });

  return res.status(200).send({
    status: "success",
    data: boxes,
    totalPages: Math.ceil(boxes.count / size),
  });
};

const detail = async (req, res) => {
  let id = req.params.id;

  const boxDetail = await Box.findOne({
    where: {
      id: id,
    },
    // attributes: {
    //   exclude: ["updatedAt"],
    // },
  });

  if (!boxDetail) {
    return res.status(404).send({
      status: "error",
      message: "Box does not exist",
    });
  }

  return res.status(200).send({
    status: "success",
    data: boxDetail,
  });
};

const update = async (req, res) => {
  let id = req.params.id;

  const boxFinded = await Box.findOne({
    where: {
      id: id,
    },
  });

  if (!boxFinded) {
    return res.status(404).send({
      status: "error",
      message: "Box does not exist",
    });
  }

  try {
    let params = req.body;

    if (
      !params.dateTo ||
      !params.title ||
      !params.areaId ||
      !params.sideId ||
      !params.stateId
    ) {
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

    const boxExist = await Box.findOne({
      where: {
        title: params.title,
        [Op.not]: { id: id },
      },
    });

    if (boxExist) {
      return res.status(200).send({
        status: "success",
        message: "There is already a box with that name",
      });
    }

    let dateMoment = moment(params.dateTo, "DD/MM/YYYY");
    await Box.update(
      {
        title: params.title,
        boxNumber: params.boxNumber,
        dateTo: dateMoment.toDate(),
        areaId: params.areaId,
        sideId: params.sideId,
        stateId: params.stateId,
        column: params.column,
        floor: params.floor,
        numberFrom: params.numberFrom,
        numberTo: params.numberTo,
        observation: params.observation,
      },
      {
        where: {
          id: id,
        },
      }
    );

    await boxFinded.reload();

    return res.status(200).send({
      status: "success",
      data: boxFinded,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to update box " + error,
    });
  }
};

const remove = async (req, res) => {
  let id = req.params.id;

  const boxToRemove = await Box.findOne({
    where: {
      id: id,
    },
  });

  if (!boxToRemove) {
    return res.status(404).send({
      status: "error",
      message: "Box does not exist",
    });
  }

  try {
    await boxToRemove.destroy();

    return res.status(200).send({
      status: "success",
      message: "The box was deleted succesfully",
      data: boxToRemove,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to delete box " + error,
    });
  }
};

module.exports = {
  test,
  create,
  list,
  detail,
  update,
  remove,
};
