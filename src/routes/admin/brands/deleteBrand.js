let express = require('express');
let multer = require('multer');

let vt_brands = require('../../../model/vt_brands');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.get('/delete-brand', upload.none(), (req, res) => {
  
  let brand_id = req.query.id;
  
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, () => {
    vt_brands.destroy({
      where:{
        id: brand_id
      }
    })
      .then((data) => {
        if(data !== null) {
          res.status(200).send({ status: 200, message: 'Brand deleted!' });
        }
        if(data === null){
          res.status(401).send({ status: 401, message: 'No Brand found!' });
        }
      })
      .catch((err) => {
        console.log(err);
      })
  })
});

module.exports = router;