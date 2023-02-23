//Dependencies
const { Op } = require("sequelize");

//Services
const general = require("../services/general");
const validateEmployee = require("../helpers/validateEmployee");

//Models
const db = require("../models/index");
const Employee = db.Employee;

const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "message sended from employee controller",
  });
};

const create = async (req, res) => {
  let params = req.body;
  if (!params.docket || !params.name || !params.lastname) {
    return res.status(400).send({
      status: "error",
      message: "Missing parameters",
    });
  }

  try {
    validateEmployee(params);
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Invalid parameters",
    });
  }

  const employeeExist = await Employee.findOne({
    where: {
      docket: params.docket,
    },
  });

  if (employeeExist) {
    return res.status(200).send({
      status: "success",
      message:
        "The employee with docket number " +
        employeeExist.docket +
        " already exist",
    });
  }

  try {
    let newEmployee = await Employee.create(params);
    return res.status(200).send({
      status: "success",
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error saving employee " + error,
    });
  }
};

const list = async (req, res) => {
  try {
    const data = await general.list(req, res, Employee);
    return res.status(200).send({
      status: "success",
      data: data,
      totalPages: Math.ceil(data.count / data.size),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error listing employees " + error,
    });
  }
};

const detail = async (req, res) => {
  let id = req.params.id;

  const employeeDetail = await Employee.findOne({
    where: {
      id: id,
    },
  });

  if (!employeeDetail) {
    return res.status(404).send({
      status: "error",
      message: "Employee does not exist",
    });
  }

  return res.status(200).send({
    status: "success",
    data: employeeDetail,
  });
};

const update = async (req, res) => {
  let id = req.params.id;

  const employeeFinded = await Employee.findOne({
    where: {
      id: id,
    },
  });

  if (!employeeFinded) {
    return res.status(404).send({
      status: "error",
      message: "Employee does not exist",
    });
  }

  try {
    let params = req.body;
    if (!params.docket || !params.name || !params.lastname) {
      return res.status(400).send({
        status: "error",
        message: "Missing parameters",
      });
    }

    try {
      validateEmployee(params);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Invalid parameters",
      });
    }

    const employeeExist = await Employee.findOne({
      where: {
        docket: params.docket,
        [Op.not]: { id: id },
      },
    });

    if (employeeExist) {
      return res.status(200).send({
        status: "success",
        message: "There is already a employee with that docket number",
      });
    }

    await Employee.update(
      {
        docket: params.docket,
        name: params.name,
        lastname: params.lastname,
      },
      {
        where: {
          id: id,
        },
      }
    );

    await employeeFinded.reload();

    return res.status(200).send({
      status: "success",
      data: employeeFinded,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to update employee " + error,
    });
  }
};

const remove = async (req, res) => {
  let id = req.params.id;

  const employeeToRemove = await Employee.findOne({
    where: {
      id: id,
    },
  });

  if (!employeeToRemove) {
    return res.status(404).send({
      status: "error",
      message: "Employee does not exist",
    });
  }

  try {
    await employeeToRemove.destroy();

    return res.status(200).send({
      status: "success",
      message: "The employee was deleted succesfully",
      data: employeeToRemove,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error trying to delete employee " + error,
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
