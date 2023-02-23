const list = async (req, res, model) => {
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

  const data = await model.findAndCountAll({
    order: [["createdAt", "DESC"]],
    limit: size,
    offset: page * size,
    size: size,
  });

  return data;
};

const getAll = async(model, attributeToOrder) => {
  const data = await model.findAll({
    order: [[attributeToOrder, "ASC"]],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  return data;
}

module.exports = {
  list,
  getAll
};
