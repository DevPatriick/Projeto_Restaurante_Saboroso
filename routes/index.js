var express = require("express");
var router = express.Router();
var connection = require("../inc/db");
var menus = require("./../inc/menus");
const Swal = require("sweetalert2");
const axios = require('axios');

const reservations = require("./../inc/reservations");
const contacts = require("./../inc/contacts");

/* GET home page. */
router.get("/", function (req, res, next) {
  menus.getMenus().then((results) => {
    res.render("index", {
      title: "Restaurante Saboroso!",
      menus: results,
    });
  });
});

router.get("/contacts", function (req, res, next) {
  contacts.render(req, res);
});

router.post("/contacts", (req, res) => {
  let error = null;

  if (!req.body.name) {
    error = "Digite o nome";
  } else if(!req.body.telephone){
    error = "Digite o telefone"
  } else if (!req.body.email) {
    error = "Digite o email";
  } else if (!req.body.message) {
    error = "Digite algo";
  } else {
    contacts.save(req.body).then((results) => {
      contacts.render(req, res);
    });
  }

  if (error) {
    return res.json({ success: false, message: error });
  }

});

router.get("/menus", function (req, res, next) {
  menus.getMenus().then((results) => {
    res.render("menus", {
      title: "Menus",
      backgroud: "images/img_bg_1.jpg",
      h1: "Saboreie nosso menu!",
      menus: results,
    });
  });
});

router.get("/reservations", function (req, res, next) {
  reservations.render(req, res);
});

router.post("/reservations", (req, res) => {
  let error = null;
  const { name, email, people, date, time, telephone } = req.body

  if (!name) {
    error = "Digite o nome para reserva";
  } else if (!email) {
    error = "Digite o e-mail para reserva";
  } else if (!people) {
    error = "Digite para quantas pessoas será a reserva";
  } else if (!date) {
    error = "Digite a data da reserva";
  } else if (!time) {
    error = "Digite a hora da reserva";
  } else if(!telephone){
    error = "Telefone"
  } else {
    reservations.save(req.body).then(async(results) => {

      try {
        await axios.post("https://api.z-api.io/instances/3DD064B1598110379BD5E2D55401DB6C/token/1416C5AC7B5E8B9E1289C036/send-text", {
          "phone": `+55${telephone}`,
          "message": `Olá ${name}, tudo bem? 😊.
          Sua reserva para o dia ${date} às ${time} foi CONFIRMADA. ✅
          Te aguardamos! 🕒🍽️`
        }, {
          headers: {
              "Content-Type": "application/json",
              "client-token": "F5ac9cc7cd09c45589b98bc38d34407bbS"
          }
        })
      } catch (error) {
        console.error(error)
      }
      
    

      reservations.render(req, res, true)
    }).catch((err)=>{
      reservations.render(req, res, false, err.message)
    })
  }

  if (error) {
    return res.json({ success: false, message: error });
  }
});

router.get("/services", function (req, res, next) {
  res.render("services", {
    title: "Serviços",
    backgroud: "images/img_bg_1.jpg",
    h1: "É um prazer poder servir!",
  });
});

module.exports = router;
