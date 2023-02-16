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
    //Tambien podria retornar como mensaje "missing parameters". Pero como es uno solo el campo que tiene que llegar no es problema
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
    let newArea = await Area.create(params);
    return res.status(200).send({
      status: "success",
      message: "Area created successfully",
      area: newArea,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error saving area " + error,
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

  const Areas = await Area.findAndCountAll({
    order: [["createdAt", "DESC"]],
    limit: size,
    offset: page * size,
  });

  return res.status(200).send({
    status: "success",
    data: Areas,
    totalPages: Math.ceil(Areas.count / size),
  });
};

const detail = async (req, res) => {
  let id = req.params.id;

  const AreaDetail = await Area.findOne({
    where: {
      id: id,
    },
    attributes: {
      exclude: ["updatedAt"],
    },
  });

  if (!AreaDetail) {
    return res.status(404).send({
      status: "error",
      message: "Area does not exist",
    });
  }

  return res.status(200).send({
    status: "success",
    data: AreaDetail,
  });
};

const update = async (req, res) => {
  let id = req.params.id;

  const AreaFinded = await Area.findOne({
    where: {
      id: id,
    },
    attributes: {
      exclude: ["updatedAt"],
    },
  });

  if (!AreaFinded) {
    return res.status(404).send({
      status: "error",
      message: "Area does not exist",
    });
  }

  try {
    let params = req.body;

    if (!params.name) {
      //Tambien podria retornar como mensaje "missing parameters". Pero como es uno solo el campo que tiene que llegar no es problema
      return res.status(400).send({
        status: "error",
        message: "The name of Area is required",
      });
    }

    await Area.update(
      {
        name: params.name,
      },
      {
        where: {
          id: id,
        },
      }
    );

    await AreaFinded.reload();

    return res.status(200).send({
      status: "success",
      data: AreaFinded,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to update area " + error,
    });
  }
};

const remove = async (req, res) => {};

module.exports = {
  test,
  create,
  list,
  detail,
  update,
  remove,
};
