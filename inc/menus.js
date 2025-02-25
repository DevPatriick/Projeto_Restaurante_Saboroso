const { query } = require("express");
let connection = require("./db");
let path = require("path");

module.exports = {
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
      fields.photo = "images/" + path.parse(files.photo.path).base;

      let query, queryPhoto = '', params = [
        fields.title,
        fields.description,
        fields.price,
      ];

      if (files.photo.name) {
        queryPhoto = ",photo = ?";
        params.push(fields.photo)
      }

      if (parseInt(fields.id) > 0) {

        params.push(fields.id);

        (query = `
        UPDATE tb_menus
        SET title = ?, description = ?, price = ?, photo = ?
        WHERE id = ?
            `)
      } else {

        if(!files.photo.name){
          reject('Envie a foto do prato')
        }
        query = ` INSERT INTO tb_menus (title, description, price, photo)
        VALUES(?, ?, ?, ?)`;
      }

      connection.query(query, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
};
