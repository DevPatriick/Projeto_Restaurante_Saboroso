var express = require('express');
var router = express.Router();
var connection = require('../inc/db')
var menus = require('./../inc/menus');
const Swal = require('sweetalert2');

const reservations = require('./../inc/reservations');

/* GET home page. */
router.get('/', function (req, res, next) {

  menus.getMenus().then(results=>{
    res.render('index', {
      title: 'Restaurante Saboroso!',
      menus: results
    })
  })
 

});

router.get('/contacts', function (req, res, next) {
  res.render('contacts', {
    title: 'Contatos',
    backgroud: 'images/img_bg_3.jpg',
    h1: "Diga um oi!"
  });
})

router.get('/menus', function (req, res, next) {
  menus.getMenus().then(results=>{
    res.render('menus', {
      title: 'Menus',
      backgroud: 'images/img_bg_1.jpg',
      h1: "Saboreie nosso menu!",
      menus: results
    })
  })

})

router.get('/reservations', function (req, res, next) {

  reservations.render(req, res);

})

router.post('/reservations', (req, res)=> {
  let error = null;

  if (!req.body.name) {
    error = "Digite o nome para reserva";
  } else if (!req.body.email) {
    error = "Digite o e-mail para reserva";
  } else if (!req.body.people) {
    error = "Digite para quantas pessoas será a reserva";
  } else if (!req.body.date) {
    error = "Digite a data da reserva";
  } else if (!req.body.time) {
    error = "Digite a hora da reserva";
  } else{
    reservations.save(req.body).then(results=>{
      reservations.render(req, res);
    })
  }

  if (error) {
    return res.json({ success: false, message: error });
  }

  
});


router.get('/services', function (req, res, next) {
  res.render('services', {
    title: 'Serviços',
    backgroud: 'images/img_bg_1.jpg',
    h1: "É um prazer poder servir!"
  });
})

module.exports = router;
