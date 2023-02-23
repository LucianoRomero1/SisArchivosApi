//Dependencies
const { Op } = require("sequelize");

//Services
const general = require("../services/general");

//Models
const db = require("../models/index");
const State = db.State;

//Endpoints
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
  try {
    const data = await general.list(req, res, State);
    return res.status(200).send({
      status: "success",
      data: data,
      totalPages: Math.ceil(data.count / data.size),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error listing states " + error,
    });
  }
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

const getAll = async (req, res) => {
  try {
    const data = await general.getAll(State, "description");
    return res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "error getting all states",
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
