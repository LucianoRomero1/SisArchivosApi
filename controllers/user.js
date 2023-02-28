//Dependencies
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

//Services
const jwt = require("../services/jwt");
const validateUser = require("../helpers/validateUser");

//Models
const db = require("../models/index");
const User = db.User;

//Endpoints
const register = async (req, res) => {
  let params = req.body;
  if (
    !params.email ||
    !params.username ||
    !params.password ||
    !params.name ||
    !params.lastname
  ) {
    return res.status(400).send({
      status: "error",
      message: "Missing parameters",
    });
  }

  try {
    validateUser(params);
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Invalid parameters",
    });
  }

  const userExist = await User.findOne({
    where: {
      [Op.or]: [{ username: params.username }, { email: params.email }],
    },
  });

  if (userExist) {
    return res.status(200).send({
      status: "success",
      message: "User already exist",
    });
  } else {
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    try {
      let userToSave = await User.create(params);
      return res.status(200).json({
        status: "success",
        message: "Successfully registered user",
        user: userToSave,
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: "Error saving user " + error,
      });
    }
  }
};

const login = async (req, res) => {
  let params = req.body;

  if (!params.username || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Missing params",
    });
  }

  const userExist = await User.findOne({
    where: {
      email: {[Op.like]: `%${params.username}%`},
      [Op.or]: [{ username: params.username }, { email: params.username }],
    },
  });

  if (!userExist) {
    return res.status(404).send({
      status: "error",
      message: "User doesnt exist",
    });
  }

  let pwd = await bcrypt.compare(params.password, userExist.password);
  if (!pwd) {
    return res.status(400).send({
      status: "error",
      message: "Invalid password",
    });
  }

  const token = await jwt.createToken(userExist);

  return res.status(200).send({
    status: "success",
    message: "Login",
    user: {
      id: userExist.id,
      username: userExist.username,
    },
    token,
  });
};

const profile = async (req, res) => {
  const id = req.params.id;

  const userProfile = await User.findOne({
    where: {
      id: id,
    },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!userProfile) {
    return res.status(404).send({
      status: "error",
      message: "User does not exist",
    });
  }

  return res.status(200).send({
    status: "success",
    user: userProfile,
  });
};

module.exports = {
  register,
  login,
  profile,
};
