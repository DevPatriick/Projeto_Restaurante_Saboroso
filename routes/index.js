var express = require('express');
var router = express.Router();
var connection = require('../inc/db')

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query(`SELECT * FROM tb_menus ORDER BY title`,
    (err, results)=>{
      try {
        res.render('index', { 
          title: 'Restaurante Saboroso!',
          menus: results
        });
      } catch (err) {
        res.send(err)
      }
    }
  )
 
});

router.get('/contacts', function(req, res, next){
  res.render('contacts', {
    title: 'Contatos'
  });
})

router.get('/menus', function(req, res, next){
  res.render('menus', 
    {
      title: 'Menus'
    }
  );
})

router.get('/reservations', function(req, res, next){
  res.render('reservations', {
    title: 'Reservas'
  });
})

router.get('/services', function(req, res, next){
  res.render('services', {
    title: 'Serviços'
  });
})

module.exports = router;
