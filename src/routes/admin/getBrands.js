let express = require('express');
let multer = require('multer');

let vt_brands = require('../../model/vt_brands');
let AdminAuth = require('../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.get('/brands', upload.none(), (req, res) => {
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, () => {
    vt_brands.findAll()
      .then((data) => {
        if(data !== null) {
          res.status(200).send({ status: 200, data: data });
        }
        if(data === null){
          res.status(401).send({ status: 401, message: 'No brands found!' });
        }
      })
      .catch((err) => {
        console.log(err);
      })
  })
});

module.exports = router;