const connection = require('../inc/db');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query("SELECT * FROM tb_users ORDER BY name", (err, result)=>{
    try {
      res.send(result)
    } catch (error) {
      res.send(err)
    }
  })
});

module.exports = router;
