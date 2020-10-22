//Creating a server with node
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
// const expressHandlebars = require("express-handlebars");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();
// For Handlebars
// app.engine(
//   "hbs",
//   expressHandlebars({
//     extname: "hbs",
//     defaultLayout: "main-layout",
//     layoutsDir: "views/layouts",
//   })
// );

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminData.router);
app.use(shopRoutes);

//Handling errors
app.use((req, res, next) => {
  res.render("404", { docTitle: "Page Not Found" });
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
