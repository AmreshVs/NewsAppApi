let express = require('express');
let multer = require('multer');

let vt_brands = require('../../../model/vt_brands');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

// Set upload.none() if no file is set to upload
router.get('/get-brand', upload.none(), (req, res) => {

  let brand_id = req.query.id;

  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, (status) => {
    if(status){
      vt_brands.findOne({
        where:{
          id: brand_id
        }
      })
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