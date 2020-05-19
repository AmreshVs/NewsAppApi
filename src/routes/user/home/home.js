let express = require('express');
let multer = require('multer');

let upload = multer();
let router = express.Router();

let config = require('../../../config/config');
let UserAuth = require('../../../commonFunctions/UserAuth');
let getNews = require('./getNews');
let getPdfs = require('./getPdfs');
let getVideos = require('./getVideos');

router.get('/home', upload.none(), (req, res) => {
  
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);

  UserAuth(req, res, async (status) => {
    if(status){
      
      let getVideosData = await getVideos(page, size);
      let getNewsData = await getNews(page, size);
      let getPdfsData = await getPdfs(page, size);

      // Pagination Logic
      // let remaining = 50 - (page * size) > 0 ? 50 - (page * size) : 0;
      let pagination = {
        nextPageUrl: (getVideosData.length === 0 && getNewsData.length === 0 && getPdfsData.length === 0 ) ? '' : `${config.APP_URL}/home?page=${page + 1}&size=${size}`,
        prevPageUrl: page === 1 ? '' : `${config.APP_URL}/home?page=${page - 1}&size=${size}`,
        // totalRows: 50,
        // totalPages: Math.ceil(50 / size),
        // remaining: remaining
      }

      let result = {
        status: 200,
        liveVideo: page === 1 ? 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' : '',
        videos: getVideosData,
        news: getNewsData,
        pdfs: getPdfsData,
        pagination: pagination
      }

      res.status(200).send(result);
    }
  })
});

module.exports = router;