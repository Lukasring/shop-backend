const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async (callback) => {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://Lukas:mandarinas123@cluster0.qrzgg.mongodb.net/shop?retryWrites=true&w=majority",
      { useUnifiedTopology: true }
    );
    if (client) console.log("CONNECTED!");
    _db = client.db();
    callback();
  } catch (err) {
    console.log("Failed to connect to MongoDB!", err);
    throw err;
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
