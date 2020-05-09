let express = require('express');
let multer = require('multer');

let vt_posts = require('../../model/vt_posts');
let AdminAuth = require('../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.get('/delete-post', upload.none(), (req, res) => {
  
  let post_id = req.query.id;
  
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, () => {
    vt_posts.destroy({
      where:{
        id: post_id
      }
    })
      .then((data) => {
        if(data !== null) {
          res.status(200).send({ status: 200, message: 'Post deleted!' });
        }
        if(data === null){
          res.status(401).send({ status: 401, message: 'No Post found!' });
        }
      })
      .catch((err) => {
        console.log(err);
      })
  })
});

module.exports = router;