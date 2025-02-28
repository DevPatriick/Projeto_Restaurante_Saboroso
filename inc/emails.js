var connection = require("./db");


module.exports = {
    getEmails() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM tb_emails ORDER BY register DESC`,
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        });
      },
      


      deleteEmails(id) {
        return new Promise((resolve, reject) => {
          connection.query(`
            DELETE FROM tb_emails
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

      // save(req) {
      //   return new Promise((resolve, reject) => {
      //     if (!req.fields.email) {
      //       console.log("Email:", req.fields.email);
      //       reject('Preencha o e-mail corretamente');
      //     } else {
      //       connection.query(
      //         `
      //         INSERT INTO tb_emails (email) VALUES (?)
      //         `,
      //         [req.fields.email],
      //         (err, results) => {
      //           if (err) {
      //             reject(err.message);
      //           } else {
      //             resolve(results);
      //           }
      //         }
      //       );
      //     }
      //   });
      // }
      
}