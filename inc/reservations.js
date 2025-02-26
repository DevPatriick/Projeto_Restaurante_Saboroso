// const { fileLoader } = require("ejs");
var connection = require("./db");
// const { param } = require("../routes");

module.exports = {
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

  getReservations() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM tb_reservations ORDER BY date DESC`,
        (err, results) => {
          try {
            resolve(results);
          } catch (err) {
            reject(err);
          }
        }
      );
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
};
