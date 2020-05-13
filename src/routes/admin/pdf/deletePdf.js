let express = require('express');
let multer = require('multer');

let vt_pdfs = require('../../../model/vt_pdfs');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.get('/delete-pdf', upload.none(), (req, res) => {
  
  let pdf_id = req.query.id;
  
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, (status) => {
    if(status){
      vt_pdfs.destroy({
        where:{
          id: pdf_id
        }
      })
        .then((data) => {
          if(data !== null) {
            res.status(200).send({ status: 200, message: 'Pdf deleted!' });
          }
          if(data === null){
            res.status(401).send({ status: 401, message: 'No Pdf found!' });
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  })
});

module.exports = router;