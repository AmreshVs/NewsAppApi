let express = require('express');
let multer = require('multer');

let vt_categories = require('../../../model/vt_categories');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.get('/delete-category', upload.none(), (req, res) => {
  
  let category_id = req.query.id;
  
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, () => {
    vt_categories.destroy({
      where:{
        id: category_id
      }
    })
      .then((data) => {
        if(data !== null) {
          res.status(200).send({ status: 200, message: 'Category deleted!' });
        }
        if(data === null){
          res.status(401).send({ status: 401, message: 'No Category found!' });
        }
      })
      .catch((err) => {
        console.log(err);
      })
  })
});

module.exports = router;