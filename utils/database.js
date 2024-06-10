const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// MongoDb

const MongoDbUrl = `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASSWORD}@${process.env.MDB_NAME}.lhmpmr9.mongodb.net/settlement-negotiation`;

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log("Db already initialized");
    return callback(null, _db);
  }
  MongoClient.connect(MongoDbUrl)
    .then((client) => {
      _db = client;
      console.log("client connected");
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error("Database not initialzed");
  }
  return _db;
};

exports.initDb = initDb; // crates first connection
exports.getDb = getDb; // allows access to db without reconencting each time
