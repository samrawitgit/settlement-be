const { BSON } = require("mongodb");
const { onSettlementSubmitted } = require("../utils/websockets");

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

exports.sortSettlementsNewToOld = async () =>
  await getDb()
    .db()
    .collection("settlements")
    .find({})
    .sort({
      createdAt: -1,
    })
    .toArray();

exports.findSettlementById = (id) =>
  getDb()
    .db()
    .collection("settlements")
    .findOne({ _id: new BSON.ObjectId(id) });

exports.addSettlement = async (req, res, next) => {
  const amount = req.body.amount;
  const status = req.body.status;
  const checkPrev = !!Number(req.body.checkPrev);

  if (checkPrev) {
    const sortedSettlements = await this.sortSettlementsNewToOld();
    if (sortedSettlements[0].status !== "pending") {
      res.status(409).json({
        alert: true,
        message:
          "Party B has sent a response on your last settlement. Please refresh the page.",
      });
      return;
    }
  }

  const settlement = await getDb().db().collection("settlements").insertOne({
    amount: amount,
    status: status,
    createdAt: new Date(),
  });

  onSettlementSubmitted({ ...settlement, amount });

  res.status(201).json(settlement);
};
