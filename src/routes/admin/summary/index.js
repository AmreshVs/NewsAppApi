let express = require('express');
let multer = require('multer');

let upload = multer();
let router = express.Router();

let AdminAuth = require('../../../commonFunctions/AdminAuth');
let getNews = require('./getNews');
let getVideos = require('./getVideos');
let getPdfs = require('./getPdfs');
let getComments = require('./getComments');

router.get('/summary', upload.none(), (req, res) => {
  
  AdminAuth(req, res, async (status) => {
    if(status){
      
      let getVideosData = await getVideos();
      let getNewsData = await getNews();
      let getPdfsData = await getPdfs();
      let getCommentsData = await getComments();

      let AllNewsData = { news: getNewsData, videos: getVideosData, pdfs: getPdfsData, comments: getCommentsData };

      let result = {
        status: 200,
        data: AllNewsData,
      }

      res.status(200).send(result);
    }
  })
});

module.exports = router;