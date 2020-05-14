let express = require('express');
let multer = require('multer');

let vt_videos = require('../../../model/vt_videos');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.get('/delete-video', upload.none(), (req, res) => {
  
  let video_id = req.query.id;
  
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, (status) => {
    if(status){
      vt_videos.destroy({
        where:{
          id: video_id
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