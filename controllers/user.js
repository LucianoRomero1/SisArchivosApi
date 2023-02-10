//Dependencies
const bcrypt = require("bcrypt");
const path = require("path");

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

  //TODO: Probar esta opcion despues
  // const UserExist = await User.findOne({
  //   where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), params.email),
  // });

  const UserExist = await User.findOne({
    where: {
      email: params.email,
      username: params.username,
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

    // let userToSave = new User(params);

    // userToSave.save((error, userStored) => {
    //   if (error || !userStored) {
    //     res.status(500).send({
    //       status: "error",
    //       message: "Error saving user",
    //     });
    //   }

    //   if (userStored) {
    //     return res.status(200).json({
    //       status: "success",
    //       message: "Successfully registered user",
    //       user: userStored,
    //     });
    //   }
    // });
  }

  // User.findOne({
  //   where: {
  //     email: params.email,
  //     username: params.username,
  //   },
  // }).exec(async (error, users) => {
  //   if (error) {
  //     return res.status(500).json({
  //       status: "error",
  //       message: "User query error",
  //     });
  //   }

  //   if (users && users.length >= 1) {
  //     return res.status(200).send({
  //       status: "success",
  //       message: "User already exist",
  //     });
  //   }

  //   let pwd = await bcrypt.hash(params.password, 10);
  //   params.password = pwd;

  //   let userToSave = new User(params);

  //   userToSave.save((error, userStored) => {
  //     if (error || !userStored) {
  //       res.status(500).send({
  //         status: "error",
  //         message: "Error saving user",
  //       });
  //     }

  //     if (userStored) {
  //       return res.status(200).json({
  //         status: "success",
  //         message: "Successfully registered user",
  //         user: userStored,
  //       });
  //     }
  //   });
  // });
};

const login = (req, res) => {};

module.exports = {
  test,
  register,
};
