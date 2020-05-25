let express = require('express');
let multer = require('multer');

let upload = multer();
let router = express.Router();

let UserAuth = require('../../../commonFunctions/UserAuth');
let getTodayPdfs = require('./getTodayPdfs');

router.get('/top-section', upload.none(), (req, res) => {

  UserAuth(req, res, async (status) => {
    if(status){
      let getTodayPdfsData = await getTodayPdfs();
      let result = {
        status: 200,
        liveVideo: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        todayPdf: getTodayPdfsData,
      }
      res.status(200).send(result);
    }
  })
});

module.exports = router;