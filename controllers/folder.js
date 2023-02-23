//Dependencies
const { Op } = require("sequelize");

//Services
const validateFolder = require("../helpers/validateFolder");
const moment = require("moment");
const general = require("../services/general");

//Models
const db = require("../models/index");
const Folder = db.Folder;

//Endpoints
const create = async (req, res) => {
  const params = req.body;
  if (
    !params.folderNumber ||
    !params.title ||
    !params.dateTo ||
    !params.stateId ||
    !params.boxId
  ) {
    return res.status(400).send({
      status: "error",
      message: "Missing parameters",
    });
  }

  try {
    validateFolder(params);
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Invalid parameters",
    });
  }

  const folderExist = await Folder.findOne({
    where: {
      [Op.or]: [{ folderNumber: params.folderNumber }, { title: params.title }],
    },
  });

  if (folderExist) {
    return res.status(200).send({
      status: "success",
      message: "There is already a folder with that name or number folder",
    });
  }

  try {
    let dateMoment = moment(params.dateTo, "DD/MM/YYYY");
    let folderToSave = await Folder.create({
      folderNumber: params.folderNumber,
      title: params.title,
      dateTo: dateMoment.toDate(),
      boxId: params.boxId,
      stateId: params.stateId,
    });

    return res.status(200).json({
      status: "success",
      message: "Successfully registered folder",
      folder: folderToSave,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error saving folder " + error,
    });
  }
};

const list = async (req, res) => {
  try {
    const data = await general.list(req, res, Folder);
    return res.status(200).send({
      status: "success",
      data: data,
      totalPages: Math.ceil(data.count / data.size),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error listing folders " + error,
    });
  }
};

const detail = async (req, res) => {
  let id = req.params.id;

  const folderDetail = await Folder.findOne({
    where: {
      id: id,
    },
  });

  if (!folderDetail) {
    return res.status(404).send({
      status: "error",
      message: "Folder does not exist",
    });
  }

  return res.status(200).send({
    status: "success",
    data: folderDetail,
  });
};

const update = async (req, res) => {
  let id = req.params.id;

  const folderFinded = await Folder.findOne({
    where: {
      id: id,
    },
  });

  if (!folderFinded) {
    return res.status(404).send({
      status: "error",
      message: "Folder does not exist",
    });
  }

  try {
    let params = req.body;

    if (
      !params.folderNumber ||
      !params.title ||
      !params.dateTo ||
      !params.stateId ||
      !params.boxId
    ) {
      return res.status(400).send({
        status: "error",
        message: "Missing parameters",
      });
    }

    try {
      validateFolder(params);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Invalid parameters",
      });
    }

    const folderExist = await Folder.findOne({
      where: {
        [Op.or]: [{ folderNumber: params.folderNumber }, { title: params.title }],
        [Op.not]: {id: id}
      },
    });
  
    if (folderExist) {
      return res.status(200).send({
        status: "success",
        message: "There is already a folder with that name or number folder",
      });
    }

    let dateMoment = moment(params.dateTo, "DD/MM/YYYY");
    await Folder.update(
      {
        numberFolder: params.numberFolder,
        title: params.title,
        dateTo: dateMoment.toDate(),
        boxId: params.boxId,
        stateId: params.stateId,
      },
      {
        where: {
          id: id,
        },
      }
    );

    await folderFinded.reload();

    return res.status(200).send({
      status: "success",
      data: folderFinded,
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

  const folderToRemove = await Folder.findOne({
    where: {
      id: id,
    },
  });

  if (!folderToRemove) {
    return res.status(404).send({
      status: "error",
      message: "Folder does not exist",
    });
  }

  try {
    await folderToRemove.destroy();

    return res.status(200).send({
      status: "success",
      message: "The folder was deleted succesfully",
      data: folderToRemove,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to delete folder " + error,
    });
  }
};

module.exports = {
  create,
  list,
  detail,
  update,
  remove,
};
