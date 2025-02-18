
module.exports = {
    render(req, res, error){
        res.render('reservations', {
            title: 'Reservas',
            backgroud: 'images/img_bg_2.jpg',
            h1: "Reserve uma Mesa!",
            body: req.body, 
          });
    }
}