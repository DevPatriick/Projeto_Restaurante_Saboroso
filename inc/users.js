let connection = require("./db");

module.exports = {
  render(req, res, success, errorMessage) {
    res.render("admin/login", {
      body: req.body,
      success,
      errorMessage,
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

  getUsers() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM tb_users ORDER BY name`,
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

  delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(`
        DELETE FROM tb_users 
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

  save(fields, files) {
    return new Promise((resolve, reject) => {
       let query, params = [
        fields.name,
        fields.email
       ];

       if(parseInt(fields.id) > 0){
        params.push(fields.id)
        query = `
        UPDATE tb_users
        SET name = ?,
            email = ?
            WHERE id = ?
        `;
       } else{
        query = `
        INSERT INTO tb_users(name, email, password)
        VALUES(?,?,?)
        `;
        params.push(fields.password)
       }

       connection.query(query, params, (err, results)=>{
        if(err){
          reject(err)
        } else {
          resolve(results)
        }
       })
    });
}
};
