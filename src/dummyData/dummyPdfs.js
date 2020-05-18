let express = require('express');
let multer = require('multer');

let DummyData = require('./dummyStatic');
let vt_pdfs = require('../model/vt_pdfs');
let upload = multer();
let router = express.Router();

router.post('/dummy-pdf', upload.none(), (req, res) => {
  let body = req.body;
  let pdfs = DummyData[0].pdfs;
  
  for(var i = 0; i < body.num; i++){
    let randNum = Math.floor(Math.random() * ((pdfs.length - 1) - 1 + 1)) + 1;
    vt_pdfs.create(pdfs[randNum]).then(() => {
      console.log('Data Inserted');
    });
  }

  res.send(body.num + ' data inserted!');

});

module.exports = router;