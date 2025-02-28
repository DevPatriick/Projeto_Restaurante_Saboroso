var express = require("express");
var users = require("../inc/users");
var router = express.Router();
var admin = require("./../inc/admin");
var menus = require("./../inc/menus");
var path = require("path");
// var reservations = require('./../inc/reservations');
var formidable = require("formidable");
var moment = require('moment');
// const { rejects } = require("assert");
moment.locale("pt-BR")
var contacts = require('./../inc/contacts')
var emails = require('./../inc/emails');
var reservations = require('./../inc/reservations.js')

router.use(function (req, res, next) {
  if (["/login"].indexOf(req.url) === -1 && !req.session.user) {
    res.redirect("/admin/login");
  } else {
    next();
  }
});

router.use(function (req, res, next) {
  req.menus = admin.getMenus(req);
  next();
});


router.get("/logout", function (req, res, next) {
  delete req.session.user;

  res.redirect("/admin/login");
});

router.get("/", function (req, res, next) {
  admin.dashboard().then((data) => {
    res.render("admin/index", {
      menus: req.menus,
      user: req.session.user,
      data
    });
  });
});

router.get("/login", function (req, res, next) {
  users.render(req, res);
});

router.post("/login", function (req, res, next) {
  const { email, password } = req.body; 

  if (!email) {
    users.render(req, res, false, "E-mail inválido");
  } else if (!password) {
    users.render(req, res, false, "Senha incorreta");
  } else {
    users
      .login(email, password)
      .then((user) => {
        req.session.user = user;
        res.redirect("/admin");
      })
      .catch((err) => {
        users.render(req, res, false, err.message || err);
      });
  }
});

router.get("/menus", function (req, res, next) {

  menus.getMenus().then((results) => {
    res.render("admin/menus", { menus: req.menus, user: req.session.user, results });
    });
  
});

function parseForm(req){

  const form = formidable.IncomingForm({
    uploadDir: path.join(__dirname, "../public/images"),
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }

      resolve({fields, files});
    })
      
  })
}

router.post("/menus", async (req, res, next) => {
  
 
  const {fields, files} = await parseForm(req);

  req.fields = fields;
  req.files = files;

  // Object.assign(req, await parseForm(req))

  try {
    const results = await menus.saver(req.fields, req.files);
    res.send({ success: true, results: results })
  } catch (error) {
    res.status(400).send({ success: false, error: err.message })
  }
  
 
  // form.parse(req, function (err, fields, files) {
  //   req.fields = fields;
  //   req.files = files;
  //   menus.saver(req.fields, req.files)
  //   .then(results => {
  //     res.send({ success: true, results: results });
  //   })
  //   .catch(err => {
  //     console.log(err) 
  //     res.status(400).send({ success: false, error: err.message });
  //   });
  // });

  
});

router.delete("/menus/:id", function(req, res, next){
  menus.delete(req.params.id).then(results=>{
    res.send(results)
  }).catch(err=>{
    res.send(err)
  })
})


router.get("/contacts", async (req, res, next) => {

  try {
    const results = await contacts.getContacts()
    res.render("admin/contacts", { menus: req.menus, user: req.session.user, results });
  } catch (error) {
    res.status(400).json(error)
  }
 
});

router.delete('/contacts/:id', async (req, res, next) => {
  try {
    const results = await contacts.deleteContacts(req.params.id)
    res.status(200).send(results)

  } catch (error) {
    
  }
})

router.get("/emails", async (req, res, next) => {

  try {
    const results = await emails.getEmails()
    res.render("admin/emails", { menus: req.menus, user: req.session.user, results });
  } catch (error) {
    res.status(400).json(error)
  }
 
});

router.delete('/emails/:id', async (req, res, next) => {
  try {
    const results = await emails.deleteEmails(req.params.id)
    res.status(200).send(results)

  } catch (error) {
    
  }
})

router.get("/reservations", function (req, res, next) {

  let start = (req.query.start) ? req.query.start : moment().subtract(1, "year").format('YYYY-MM-DD')
  let end = (req.query.start) ? req.query.start : moment().format('YYYY-MM-DD')
  reservations.getReservations(
    req
  ).then((pag)=>{
    res.render("admin/reservations", { menus: req.menus, user: req.session.user, results, moment, date: {
      start, end
    }, data: pag.data, moment, links: pag.links });
  })
});

router.post("/reservations", async (req, res, next)=>{
  console.log("Campos recebidos:", req.fields); // Verificar os dados

  if (!req.fields) {
    return res.status(400).send({ success: false, error: "Nenhum dado enviado!" });
  }

  const { name, email, people, date, time, telephone } = req.fields;

  try {
    const results = await reservations.save(req.fields, req.files)
    res.send({ success: true, results: results });

    try {
      await axios.post("https://api.z-api.io/instances/3DD3AC72A71C20CC0F4E9A31D728A9CF/token/1CDEB9060DC27A5935FBB492/send-text", {
        "phone": `+55${telephone}`,
        "message": `Olá ${name}, tudo bem? 😊.
        Sua reserva para o dia ${date} às ${time} foi CONFIRMADA. ✅
        Te aguardamos! 🕒🍽️`
      }, {
        headers: {
          "Content-Type": "application/json",
          "client-token": "F8ce8594579e94de2b8d2899369be25dbS"
        }
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  } catch (error) {
    res.status(500).send({ success: false, error: err.message });
  }
 

  
});


router.delete("/reservations/:id", function(req, res, next){
  reservations.delete(req.params.id).then(results=>{
    res.send(results)
  }).catch(err=>{
    res.send(err)
  })
})

router.get("/users", function (req, res, next) {
  users.getUsers().then(results=>{
    res.render("admin/users", { menus: req.menus, user: req.session.user, results});
  })
  
});

router.post("/users", async (req, res, next) => {

  try {
    const results = await users.save(req.fields);
    res.send(results)
  } catch (error) {
    res.send(error)
  }
 
});

router.post('/users/password-change', async(req, res, next)=>{

  try {
    const results = await users.changePassword(req);
    res.status(200).send(results)
  } catch (err) {
    res.status(400).send({error: err})
  }
})

router.delete("/users/:id", function(req, res, next){
  users.delete(req.params.id).then(results=>{
    res.send(results)
  }).catch(err=>{
    res.send(err)
  })
})

module.exports = router;
