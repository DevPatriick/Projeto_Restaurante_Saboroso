let connection = require("./db");

module.exports = {
  render(req, res, success, errorMessage) {
    res.render("admin/login", {
      body: req.body,
      success,
      errorMessage
    });
  },

  login(email, password) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM tb_users WHERE email = ?`,
        [email],
        (err, result) => {
          if (err) {
            return reject(err);
          }

          if (result.length === 0) {
            return reject("Usuário ou Senha Incorretos");
          }

          let row = result[0];

          if (row.password !== password) {
            return reject("Usuário ou Senha Incorretos");
          }

          resolve(row);
        }
      );
    });
  },
};
