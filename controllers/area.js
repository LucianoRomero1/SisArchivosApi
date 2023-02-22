//Dependencies
const { Op } = require("sequelize");

//Services
const general = require("../services/general");

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
      message: "The name of area is required",
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
    let newArea = await Area.create({
      name: params.name.toUpperCase(),
    });
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
  try {
    const data = await general.list(req, res, Area);
    return res.status(200).send({
      status: "success",
      data: data,
      totalPages: Math.ceil(data.count / data.size),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error listing areas " + error,
    });
  }
};

const detail = async (req, res) => {
  let id = req.params.id;

  const AreaDetail = await Area.findOne({
    where: {
      id: id,
    },
    // attributes: {
    //   exclude: ["updatedAt"],
    // },
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

    const AreaExist = await Area.findOne({
      where: {
        name: params.name,
        [Op.not]: { id: id },
      },
    });

    if (AreaExist) {
      return res.status(200).send({
        status: "success",
        message: "The area " + AreaExist.name + " already exist",
      });
    }

    await Area.update(
      {
        name: params.name.toUpperCase(),
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

const remove = async (req, res) => {
  let id = req.params.id;

  const AreaToRemove = await Area.findOne({
    where: {
      id: id,
    },
  });

  if (!AreaToRemove) {
    return res.status(404).send({
      status: "error",
      message: "Area does not exist",
    });
  }

  try {
    await AreaToRemove.destroy();

    return res.status(200).send({
      status: "success",
      message: "The area was deleted succesfully",
      data: AreaToRemove,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to delete area " + error,
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
