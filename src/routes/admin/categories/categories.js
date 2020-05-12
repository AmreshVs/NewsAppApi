let express = require('express');
let multer = require('multer');

let vt_categories = require('../../../model/vt_categories');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

// Set upload.none() if no file is set to upload
router.get('/categories', upload.none(), (req, res) => {

  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, (status) => {
    if(status){
      vt_categories.findAll()
        .then((data) => {
          if(data !== null) {
            res.status(200).send({ status: 200, data: data });
          }
          if(data === null){
            res.status(401).send({ status: 401, message: 'No Categories found!' });
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  })
});

module.exports = router;