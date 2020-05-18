let express = require('express');
let multer = require('multer');

let DummyData = require('./dummyStatic');
let vt_videos = require('../model/vt_videos');
let upload = multer();
let router = express.Router();

router.post('/dummy-videos', upload.none(), (req, res) => {
  
  let body = req.body;
  let videos = DummyData[0].videos;
  
  for(var i = 0; i < body.num; i++){
    let randNum = Math.floor(Math.random() * ((videos.length - 1) - 1 + 1)) + 1;
    vt_videos.create(videos[randNum]).then(() => {
      console.log('Data Inserted');
    });
  }

  res.send(body.num + ' data inserted!');

});

module.exports = router;