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

module.exports = router;
