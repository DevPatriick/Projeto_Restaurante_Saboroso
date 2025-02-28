// const { fileLoader } = require("ejs");
// const { param } = require("../routes/admin");
var connection = require("./db");
var Pagination = require("./Pagination")
var moment = require('moment')
// const { param } = require("../routes");

module.exports = {

  delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(`
        DELETE FROM tb_reservations
        WHERE id = ?`, [
          id
        ], (err, results)=>{
          if(err){
            reject(err)
          } else{
            resolve(results)
          }
        })
    });
  },

  render(req, res, success, errorMessage) {
    res.render("reservations", {
      title: "Reservas",
      backgroud: "images/img_bg_2.jpg",
      h1: "Reserve uma Mesa!",
      body: req.body,
      success,
      errorMessage,
    });
  },

  
  

  save(fields) {
    return new Promise((resolve, reject) => {
      console.log(fields);
      if(fields.date.indexOf('/') > -1 ){
        let date = fields.date.split("/");
        fields.date = `${date[2]}-${date[1]}-${date[0]}`;
      }
      

      let query,
        params = [
          fields.name,
          fields.email,
          fields.people,
          fields.date,
          fields.time,
          fields.telephone,
        ];

      if (parseInt(fields.id) > 0) {
        (query = `
          UPDATE tb_reservations
          SET
             name = ?,
             email = ?, 
             people = ?,
             date = ?, 
             time = ?, 
             telephone = ?
          WHERE id = ?
        `),
          params.push(fields.id);
      } else {
       query = `
            INSERT INTO tb_reservations (name, email, people, date, time, telephone)
            VALUE(?,?,?,?,?,?)
            `
      }

      connection.query(query, params,
        (error, results) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  },

  getReservations(req) {

    return new Promise((resolve, reject)=>{

      let page = req.query.page;
      let dtstart = req.query.start;
      let dtend = req.query.end
      if (!page) page = 1;
  
      let params = [];
    
      if (dtstart && dtend) params.push(dtstart, dtend);
    
      let pag = new Pagination(
        `SELECT SQL_CALC_FOUND_ROWS * 
         FROM tb_reservations
         ${(dtstart && dtend) ? 'WHERE date BETWEEN  ? AND ?' : ''}
         ORDER BY name LIMIT ?, ?`, params, 10
      );
      
      pag.getPage(page).then(data=>{
        resolve({
          data, links: pag.getNavigation(req.query)
        })
      })
    })
   
  },

  chart(req){
      return new Promise((resolve, reject)=>{
        connection.query =`
        SELECT CONCAT(YEAR(date), '-', MONTH(date)) AS date, COUNT(*) AS total, SUM(people) / COUNT(*) AS avg_people
                FROM tb_reservations
                WHERE date BETWEEN ? AND ?
                GROUP BY YEAR(date), MONTH(date)
                ORDER BY YEAR(date), MONTH(date)
        `, [req.query.start, req.query.end], 
        (err, result)=>{
        if(err){
          reject(err)
        } else{
          let months = [];
          let values = [];

          result.forEach(row=>{
            months.push(row.date).format('MMM YYYY')
            values.push(row.total)
          })
        }
                }
                resolve({
                  months, values
                })
    })
  }
};
