var express = require("express");
const users = require("../inc/users");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("admin/index", {});
});

router.get("/login", function (req, res, next) {
  users.render(req, res);
});

router.post("/login", function (req, res, next) {
  const { email, password } = req.body;
  if (!email) {
    users.render(req, res, false, "E-mail inválido");
  } else if (!password) {
    users.render(req, res, false, "Senha incorreta");
  } else {
    users.login(email, password).then((user) => {
        req.session.user = user;
        res.redirect("/admin");
      })
      .catch((err) => {
        users.render(req, res, false, err.message || err);
      });
  }
});

router.get("/emails", function (req, res, next) {
  res.render("admin/emails", {});
});

router.get("/menus", function (req, res, next) {
  res.render("admin/menus", {});
});

router.get("/contacts", function (req, res, next) {
  res.render("admin/contacts", {});
});

router.get("/reservations", function (req, res, next) {
  res.render("admin/reservations", {
    date: {},
  });
});

router.get("/users", function (req, res, next) {
  res.render("admin/users", {});
});

module.exports = router;
