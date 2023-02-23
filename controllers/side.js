//Dependencies
const { Op } = require("sequelize");

//Services
const general = require("../services/general");

//Models
const db = require("../models/index");
const Side = db.Side;

//Endpoints
const create = async (req, res) => {
  const params = req.body;

  if (!params.name) {
    //Tambien podria retornar como mensaje "missing parameters". Pero como es uno solo el campo que tiene que llegar no es problema
    return res.status(400).send({
      status: "error",
      message: "The name of side is required",
    });
  }

  const SideExist = await Side.findOne({
    where: {
      name: params.name,
    },
  });

  if (SideExist) {
    return res.status(200).send({
      status: "success",
      message: "The side " + SideExist.name + " already exist",
    });
  }

  try {
    let newSide = await Side.create({
      name: params.name.toUpperCase(),
    });
    return res.status(200).send({
      status: "success",
      message: "Side created successfully",
      side: newSide,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error saving side " + error,
    });
  }
};

const list = async (req, res) => {
  try {
    const data = await general.list(req, res, Side);
    return res.status(200).send({
      status: "success",
      data: data,
      totalPages: Math.ceil(data.count / data.size),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error listing sides " + error,
    });
  }
};

const detail = async (req, res) => {
  let id = req.params.id;

  const SideDetail = await Side.findOne({
    where: {
      id: id,
    },
    // attributes: {
    //   exclude: ["updatedAt"],
    // },
  });

  if (!SideDetail) {
    return res.status(404).send({
      status: "error",
      message: "Side does not exist",
    });
  }

  return res.status(200).send({
    status: "success",
    data: SideDetail,
  });
};

const update = async (req, res) => {
  let id = req.params.id;

  const SideFinded = await Side.findOne({
    where: {
      id: id,
    },
  });

  if (!SideFinded) {
    return res.status(404).send({
      status: "error",
      message: "Side does not exist",
    });
  }

  try {
    let params = req.body;

    if (!params.name) {
      //Tambien podria retornar como mensaje "missing parameters". Pero como es uno solo el campo que tiene que llegar no es problema
      return res.status(400).send({
        status: "error",
        message: "The name of side is required",
      });
    }

    const SideExist = await Side.findOne({
      where: {
        name: params.name,
        [Op.not]: { id: id },
      },
    });

    if (SideExist) {
      return res.status(200).send({
        status: "success",
        message: "The side " + SideExist.name + " already exist",
      });
    }

    await Side.update(
      {
        name: params.name.toUpperCase(),
      },
      {
        where: {
          id: id,
        },
      }
    );

    await SideFinded.reload();

    return res.status(200).send({
      status: "success",
      data: SideFinded,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to update Side " + error,
    });
  }
};

const remove = async (req, res) => {
  let id = req.params.id;

  const SideToRemove = await Side.findOne({
    where: {
      id: id,
    },
  });

  if (!SideToRemove) {
    return res.status(404).send({
      status: "error",
      message: "Side does not exist",
    });
  }

  try {
    await SideToRemove.destroy();

    return res.status(200).send({
      status: "success",
      message: "The side was deleted succesfully",
      data: SideToRemove,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to delete side " + error,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const data = await general.getAll(Side, "name");
    return res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "error getting all sides",
    });
  }
};

module.exports = {
  create,
  list,
  detail,
  update,
  remove,
  getAll
};
