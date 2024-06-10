const { ObjectId, BSON } = require("mongodb");

const getDb = require("../utils/database").getDb;

exports.getLastResponse = async (req, res, next) => {
  const response = await getDb()
    .db()
    .collection("responses")
    .find({})
    .sort({
      createdAt: -1,
    })
    .toArray();

  res.json(response[0].response === "agree");
};

exports.addResponse = async (req, res, next) => {
  // check if it's unique & update status on settlements collections
  const settlement = await getDb()
    .db()
    .collection("settlements")
    .find({})
    .sort({
      createdAt: -1,
    })
    .toArray();
  if (settlement[0].status !== "pending") {
    res.status(500).json({ error: true, message: "No active offers" });
  } else {
    const updateSettlement = await getDb()
      .db()
      .collection("settlements")
      .updateOne(
        {
          _id: new BSON.ObjectId(req.body.settlementId),
          status: "pending",
        },
        { $set: { status: Number(req.body.response) ? "agree" : "dispute" } }
      );
    const findCurrentIdRes = await getDb()
      .db()
      .collection("responses")
      .findOne({ _id: new BSON.ObjectId(req.body.settlementId) });

    if (updateSettlement || !findCurrentIdRes) {
      const response = await getDb()
        .db()
        .collection("responses")
        .insertOne({
          settlementId: req.body.settlementId,
          response: Number(req.body.response) ? "agree" : "dispute",
          createdAt: new Date(),
        });

      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json({ error: true, message: "Cannot respond multiple times" });
    }
  }
};
