const { fileLoader } = require("ejs");
var connection = require("./db");

module.exports = {
  render(req, res, error) {
    res.render("contacts", {
      title: "Contatos",
      backgroud: "images/img_bg_3.jpg",
      h1: "Diga um oi!",
      body: req.body,
    });
  },

  save(fields) {
    return new Promise((resolve, reject) => {
    //   console.log("Salvando no banco:", fields);
      connection.query(
        `
                INSERT INTO tb_contacts (name, email, message, telephone)
                VALUE(?,?,?,?)
                `,
        [fields.name, fields.email, fields.message, fields.telephone],
        (error, results) => {
          if (error) {
            reject(error);
            console.error(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  },
};
