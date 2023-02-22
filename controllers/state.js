//Dependencies
const { Op } = require("sequelize");

//Models
const db = require("../models/index");
const State = db.State;

//Endpoints
const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Message sended from state controller",
  });
};

const create = async (req, res) => {
  const params = req.body;

  if (!params.description) {
    //Tambien podria retornar como mensaje "missing parameters". Pero como es uno solo el campo que tiene que llegar no es problema
    return res.status(400).send({
      status: "error",
      message: "The description of state is required",
    });
  }

  const stateExist = await State.findOne({
    where: {
      description: params.description,
    },
  });

  if (stateExist) {
    return res.status(200).send({
      status: "success",
      message: "The state " + stateExist.description + " already exist",
    });
  }

  try {
    let newState = await State.create({
      description: params.description.toUpperCase(),
    });
    return res.status(200).send({
      status: "success",
      message: "state created successfully",
      state: newState,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error saving state " + error,
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

  const states = await State.findAndCountAll({
    order: [["createdAt", "DESC"]],
    limit: size,
    offset: page * size,
  });

  return res.status(200).send({
    status: "success",
    data: states,
    totalPages: Math.ceil(states.count / size),
  });
};

const detail = async (req, res) => {
  let id = req.params.id;

  const stateDetail = await State.findOne({
    where: {
      id: id,
    },
    // attributes: {
    //   exclude: ["updatedAt"],
    // },
  });

  if (!stateDetail) {
    return res.status(404).send({
      status: "error",
      message: "state does not exist",
    });
  }

  return res.status(200).send({
    status: "success",
    data: stateDetail,
  });
};

const update = async (req, res) => {
  let id = req.params.id;

  const stateFinded = await State.findOne({
    where: {
      id: id,
    },
  });

  if (!stateFinded) {
    return res.status(404).send({
      status: "error",
      message: "state does not exist",
    });
  }

  try {
    let params = req.body;

    if (!params.description) {
      //Tambien podria retornar como mensaje "missing parameters". Pero como es uno solo el campo que tiene que llegar no es problema
      return res.status(400).send({
        status: "error",
        message: "The description of state is required",
      });
    }

    const stateExist = await State.findOne({
      where: {
        description: params.description,
        [Op.not]: { id: id },
      },
    });

    if (stateExist) {
      return res.status(200).send({
        status: "success",
        message: "The state " + stateExist.description + " already exist",
      });
    }

    await State.update(
      {
        description: params.description.toUpperCase(),
      },
      {
        where: {
          id: id,
        },
      }
    );

    await stateFinded.reload();

    return res.status(200).send({
      status: "success",
      data: stateFinded,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to update state " + error,
    });
  }
};

const remove = async (req, res) => {
  let id = req.params.id;

  const stateToRemove = await State.findOne({
    where: {
      id: id,
    },
  });

  if (!stateToRemove) {
    return res.status(404).send({
      status: "error",
      message: "state does not exist",
    });
  }

  try {
    await stateToRemove.destroy();

    return res.status(200).send({
      status: "success",
      message: "The state was deleted succesfully",
      data: stateToRemove,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to delete state " + error,
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
