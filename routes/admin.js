var express = require("express");
const users = require("../inc/users");
var router = express.Router();
var admin = require("./../inc/admin");
var menus = require("./../inc/menus")

router.use(function (req, res, next) {
  if (["/login"].indexOf(req.url) === -1 && !req.session.user) {
    res.redirect("/admin/login");
  } else {
    next();
  }
});

router.use(function (req, res, next) {
  req.menus = admin.getMenus(req);
  next();
});

router.get("/logout", function (req, res, next) {
  delete req.session.user;

  res.redirect("/admin/login");
});

router.get("/", function (req, res, next) {
  admin.dashboard().then((data) => {
    res.render("admin/index", {
      menus: req.menus,
      user: req.session.user,
      data
    });
  });
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
    users
      .login(email, password)
      .then((user) => {
        req.session.user = user;
        res.redirect("/admin");
      })
      .catch((err) => {
        users.render(req, res, false, err.message || err);
      });
  }
});


router.get("/emails", function (req, res, next) {
  res.render("admin/emails", {
    menus: req.menus,
    user: req.session.user,
  });
});

router.get("/menus", function (req, res, next) {

  menus.getMenus().then((results) => {
    res.render("admin/menus", { menus: req.menus, user: req.session.user, results });
    });
  
});

router.post("/menus", function(req, res, next){
  menus.saver(req.fields, req.files)
    .then(results => {
      res.send({ success: true, results: results });
    })
    .catch(err => {
      res.status(500).send({ success: false, error: err.message });
    });
});

router.delete("/menus/:id", function(req, res, next){
  menus.delete(req.params.id).then(results=>{
    res.send(results)
  }).catch(err=>{
    res.send(err)
  })
})


router.get("/contacts", function (req, res, next) {
  res.render("admin/contacts", { menus: req.menus, user: req.session.user });
});

router.get("/reservations", function (req, res, next) {
  res.render("admin/reservations", {
    date: {},
    menus: req.menus,
    user: req.session.user,
  });
});

router.get("/users", function (req, res, next) {
  res.render("admin/users", { menus: req.menus, user: req.session.user });
});

module.exports = router;
