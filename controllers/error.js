exports.get404 = (req, res, next) => {
  res.render("404", {
    docTitle: "Page Not Found",
    path: req.path,
    isAuthenticated: req.isLoggedIn,
  });
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
};
