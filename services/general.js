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

const detail = async (req, res, model) => {
  let id = req.params.id;

  const modelDetail = await model.findOne({
    where: {
      id: id,
    },
    // attributes: {
    //   exclude: ["updatedAt"],
    // },
  });

  return modelDetail;
};

module.exports = {
  list,
  detail,
};
