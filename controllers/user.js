//Dependencies
const bcrypt = require("bcrypt");
const path = require("path");
const { Op } = require("sequelize");

//Services
const jwt = require("../services/jwt");
const validate = require("../helpers/validate");
const { Sequelize, sequelize } = require("../models/index");

//Models
const db = require("../models/index");
const User = db.User;

//Endpoints
const test = (req, res) => {
  return res.status(200).send({
    message: "Message from UserController",
  });
};

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
    validate(params);
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Invalid parameters",
    });
  }

  const UserExist = await User.findOne({
    where: {
      [Op.or]: [{ username: params.username }, { email: params.email }],
    },
  });

  if (UserExist) {
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

  const UserExist = await User.findOne({
    where: {
      [Op.or]: [{ username: params.username }, { email: params.username }],
    },
  });

  if (!UserExist) {
    return res.status(404).send({
      status: "error",
      message: "User doesnt exist",
    });
  }

  let pwd = await bcrypt.compare(params.password, UserExist.password);
  if (!pwd) {
    return res.status(400).send({
      status: "error",
      message: "Invalid password",
    });
  }

  const token = await jwt.createToken(UserExist);

  return res.status(200).send({
    status: "success",
    message: "Login",
    user: {
      id: UserExist.id,
      username: UserExist.username,
    },
    token,
  });
};

const profile = async (req, res) => {
  const id = req.params.id;

  const UserProfile = await User.findOne({
    where: {
      id: id,
    },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!UserProfile) {
    return res.status(404).send({
      status: "error",
      message: "User does not exist",
    });
  }

  return res.status(200).send({
    status: "success",
    user: UserProfile,
  });
};

module.exports = {
  test,
  register,
  login,
  profile,
};
