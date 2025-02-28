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

  getContacts() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM tb_contacts ORDER BY register DESC`,
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

  deleteContacts(id) {
    return new Promise((resolve, reject) => {
      connection.query(`
        DELETE FROM tb_contacts
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
};
