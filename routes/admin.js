var express = require("express");
const users = require("../inc/users");
var router = express.Router();
var admin = require("./../inc/admin");
var menus = require("./../inc/menus");
var reservations = require('./../inc/reservations')
var moment = require('moment');
moment.locale("pt-BR")

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
  reservations.getReservations().then((results)=>{
    res.render("admin/reservations", { menus: req.menus, user: req.session.user, results, moment });
  })
});

router.post("/reservations", function(req, res, next){
  console.log("Campos recebidos:", req.fields); // Verificar os dados

  if (!req.fields) {
    return res.status(400).send({ success: false, error: "Nenhum dado enviado!" });
  }

  const { name, email, people, date, time, telephone } = req.fields;

  reservations.save(req.fields, req.files)
    .then(async results => {
      res.send({ success: true, results: results });

      try {
        await axios.post("https://api.z-api.io/instances/3DD3AC72A71C20CC0F4E9A31D728A9CF/token/1CDEB9060DC27A5935FBB492/send-text", {
          "phone": `+55${telephone}`,
          "message": `Olá ${name}, tudo bem? 😊.
          Sua reserva para o dia ${date} às ${time} foi CONFIRMADA. ✅
          Te aguardamos! 🕒🍽️`
        }, {
          headers: {
            "Content-Type": "application/json",
            "client-token": "F8ce8594579e94de2b8d2899369be25dbS"
          }
        });
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      }
    })
    .catch(err => {
      res.status(500).send({ success: false, error: err.message });
    });
});


router.delete("/reservations/:id", function(req, res, next){
  reservations.delete(req.params.id).then(results=>{
    res.send(results)
  }).catch(err=>{
    res.send(err)
  })
})

router.get("/users", function (req, res, next) {
  res.render("admin/users", { menus: req.menus, user: req.session.user });
});

module.exports = router;
