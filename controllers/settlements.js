const getDb = require("../utils/database").getDb;

exports.getLastSettlement = async (req, res, next) => {
  const settlement = await getDb()
    .db()
    .collection("settlements")
    .find({})
    .sort({
      createdAt: -1,
    })
    .toArray();

  res.json({
    settlementId: settlement[0]._id,
    amount: settlement[0].amount,
    status: settlement[0].status,
  });
};

exports.addSettlement = async (req, res, next) => {
  const amount = req.body.amount;
  const status = req.body.status;

  const settlement = await getDb().db().collection("settlements").insertOne({
    amount: amount,
    status: status,
    createdAt: new Date(),
  });

  res.status(201).json(settlement);
};
