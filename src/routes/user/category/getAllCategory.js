let express = require('express');
let multer = require('multer');

let vt_categories = require('../../../model/vt_categories');
let UserAuth = require('../../../commonFunctions/UserAuth');

let upload = multer();
let router = express.Router();

router.get('/get-all-user-category', upload.none(), (req, res) => {

  // Authenticate User with token and then proceed
  UserAuth(req, res, (status) => {
    if (status) {
      // Returns rows that match the condition and the total row counts aswell
      vt_categories.findAll()
        .then((data) => {
          if (data !== null) {
            data = data.map((item) => {
              return {
                id: item.id,
                name: item.name,
              }
            })
            res.status(200).send({ status: 200, message: '', data: data });
          }
          if (data === null) {
            res.status(401).send({ status: 401, message: 'No Post found!' });
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  })
});

module.exports = router;