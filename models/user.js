const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  let newQuantity = 1;
  let updatedCartItems = [...this.cart.items];

  const cartProductIndex = this.cart.items.findIndex(
    (cartItem) => cartItem.productId.toString() === product._id.toString()
  );
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  console.log("Adding product!");
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item._id.toString() !== productId.toString()
  );
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart; // {items: [...]}
//     this._id = id;
//   }

//   save() {
//     try {
//       const db = getDb();
//       return db.collection("users").insertOne(this);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   addToCart(product) {
//     const db = getDb();
//     let newQuantity = 1;
//     let updatedCartItems = [...this.cart.items];

//     const cartProductIndex = this.cart.items.findIndex(
//       (cartItem) => cartItem.productId.toString() === product._id.toString()
//     );
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     console.log("Adding product!");
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   async getCart() {
//     try {
//       const db = getDb();
//       const productIds = this.cart.items.map((item) => item.productId);
//       const products = await db
//         .collection("products")
//         .find({ _id: { $in: productIds } })
//         .toArray();
//       const productsWithQuantity = products.map((product) => {
//         return {
//           ...product,
//           quantity: this.cart.items.find(
//             (item) => item.productId.toString() === product._id.toString()
//           ).quantity,
//         };
//       });
//       return productsWithQuantity;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   deleteCartItem(id) {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== id.toString()
//     );
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   async addOrder() {
//     const db = getDb();
//     const products = await this.getCart();
//     const order = {
//       items: products,
//       user: {
//         _id: new mongodb.ObjectId(this._id),
//         name: this.name,
//         email: this.email,
//       },
//     };
//     const objectInserted = await db.collection("orders").insertOne(order);
//     let databaseUpdated;
//     if (objectInserted) {
//       this.cart = { items: [] };
//       databaseUpdated = await db
//         .collection("users")
//         .updateOne(
//           { _id: mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         );
//     }
//     if (databaseUpdated) return objectInserted;
//   }

//   async getOrders() {
//     const db = getDb();
//     const orders = await db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this._id) })
//       .toArray();
//     return orders;
//   }

//   static findUserById(id) {
//     try {
//       const db = getDb();
//       return db
//         .collection("users")
//         .find({ _id: mongodb.ObjectId(id) })
//         .next();
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }

// module.exports = User;
