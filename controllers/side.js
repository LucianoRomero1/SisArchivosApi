//Dependencies
const { Op } = require("sequelize");

//Models
const db = require("../models/index");
const Side = db.Side;

//Endpoints
const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Message sended from side controller",
  });
};

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

  const Sides = await Side.findAndCountAll({
    order: [["createdAt", "DESC"]],
    limit: size,
    offset: page * size,
  });

  return res.status(200).send({
    status: "success",
    data: Sides,
    totalPages: Math.ceil(Sides.count / size),
  });
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

module.exports = {
  test,
  create,
  list,
  detail,
  update,
  remove,
};
