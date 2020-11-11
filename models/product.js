const { getDb } = require("../utils/database");
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, userId, prodId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this._id = prodId ? new mongodb.ObjectId(prodId) : null;
  }

  async save() {
    try {
      const db = getDb();
      let dbOperation;
      if (this._id) {
        //update the product
        dbOperation = db.collection("products").updateOne(
          { _id: this._id },
          {
            $set: this,
          }
        );
      } else {
        dbOperation = db.collection("products").insertOne(this);
      }
      return await dbOperation;
    } catch (err) {
      console.log(err);
    }
  }
  static async fetchAll() {
    try {
      const db = getDb();
      return await db.collection("products").find().toArray();
    } catch (err) {
      console.log(err);
    }
  }
  static findById(prodId) {
    try {
      const db = getDb();
      return db
        .collection("products")
        .find({ _id: mongodb.ObjectId(prodId) })
        .next();
    } catch (err) {
      console.log(err);
    }
  }
  static async deleteById(prodId) {
    try {
      const db = getDb();
      return await db
        .collection("products")
        .deleteOne({ _id: new mongodb.ObjectId(prodId) });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Product;
