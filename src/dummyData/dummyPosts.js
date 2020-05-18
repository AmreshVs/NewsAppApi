let express = require('express');
let multer = require('multer');

let DummyData = require('./dummyStatic');
let vt_posts = require('../model/vt_posts');
let upload = multer();
let router = express.Router();

router.post('/dummy-posts', upload.none(), (req, res) => {
  let body = req.body;
  let posts = DummyData[0].posts;
  
  for(var i = 0; i < body.num; i++){
    let randNum = Math.floor(Math.random() * ((posts.length - 1) - 1 + 1)) + 1;
    vt_posts.create(posts[randNum]).then(() => {
      console.log('Data Inserted');
    });
  }

  res.send(body.num + ' data inserted!');

});

module.exports = router;