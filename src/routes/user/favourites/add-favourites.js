let express = require('express');
let multer = require('multer');

let UserAuth = require('../../../commonFunctions/UserAuth');
let vt_favourites = require('../../../model/vt_favourites');

let upload = multer();
let router = express.Router();

router.post('/add-favourites', upload.none(), (req, res) => {

  let body = req.body;

  UserAuth(req, res, (status) => {
    if (status) {
      vt_favourites.findOne({
        where: {
          user_id: body.user_id
        }
      })
        .then((favorite) => {
          if (favorite === null) {
            vt_favourites.create({ user_id: body.user_id, [body.type]: body.id });
            res.send({ status: 200, message: 'Favourite Added!' });
          }
          else {
            let favourites = favorite[body.type] !== undefined && favorite[body.type].length > 0 ? (favorite[body.type]).split(',') : [];
            if (!favourites.includes(body.id)) {
              favourites.push(body.id);
              favorite.update({
                [body.type]: favourites.join(','),
                updated_at: new Date()
              })
                .then(() => {
                  res.send({ status: 200, message: 'Favourite Added!' });
                })
                .catch((err) => {
                  res.send({ status: 401, message: 'Error', error: err });
                })
            }
            else {
              let index = favourites.indexOf(String(body.id));
              let filteredFavourites = favourites.filter(item => item !== favourites[index]);
              favorite.update({
                [body.type]: filteredFavourites.join(','),
                updated_at: new Date()
              })
                .then(() => {
                  res.send({ status: 200, message: 'Favourite Removed' });
                })
                .catch((err) => {
                  res.send({ status: 401, message: 'Error', error: err });
                })
            }
          }
        })
    }
  })
});

module.exports = router;