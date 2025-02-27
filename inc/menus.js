const { query } = require("express");
let connection = require("./db");
let path = require("path");

module.exports = {
  delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(`
        DELETE FROM tb_menus 
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

  getMenus() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM tb_menus ORDER BY title`,
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
  saver(fields, files) {
    return new Promise((resolve, reject) => {
        let query, params;

        // Verifica se um novo arquivo foi enviado
        let hasNewPhoto = files.photo && files.photo.name;
        let photoPath = hasNewPhoto ? "images/" + path.parse(files.photo.path).base : null;

        if (parseInt(fields.id) > 0) {
            // Atualizando um registro existente
            connection.query(`SELECT photo FROM tb_menus WHERE id = ?`, [fields.id], (err, results) => {
                if (err) return reject(err);
                
                let currentPhoto = results.length > 0 ? results[0].photo : null;
                let finalPhoto = hasNewPhoto ? photoPath : currentPhoto;

                query = `
                    UPDATE tb_menus
                    SET title = ?, description = ?, price = ?, photo = ?
                    WHERE id = ?
                `;

                params = [fields.title, fields.description, fields.price, finalPhoto, fields.id];

                connection.query(query, params, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

        } else {
            // Inserindo um novo registro
            if (!hasNewPhoto) {
                return reject("Envie a foto do prato");
            }

            query = `
                INSERT INTO tb_menus (title, description, price, photo)
                VALUES (?, ?, ?, ?)
            `;

            params = [fields.title, fields.description, fields.price, photoPath];

            connection.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        }
    });
}

};
