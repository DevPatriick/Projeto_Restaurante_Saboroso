const { fileLoader } = require("ejs");
var connection = require("./db");

module.exports = {
  render(req, res, success, errorMessage) {
    res.render("reservations", {
      title: "Reservas",
      backgroud: "images/img_bg_2.jpg",
      h1: "Reserve uma Mesa!",
      body: req.body,
      success,
      errorMessage
    });
  },

  // função para inserir no bando de dados

  save(fields) {
    return new Promise((resolve, reject) => {
      let date = fields.date.split("/");
      fields.date = `${date[2]}-${date[1]}-${date[0]}`;

      connection.query(
        `
            INSERT INTO tb_reservations (name, email, people, date, time, telephone)
            VALUE(?,?,?,?,?,?)
            `,
        [
          fields.name,
          fields.email,
          fields.people,
          fields.date,
          fields.time,
          fields.telephone,
        ],
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
