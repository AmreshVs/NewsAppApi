let express = require('express');
let multer = require('multer');
let _ = require('lodash');

let upload = multer();
let router = express.Router();

let config = require('../../../config/config');
let UserAuth = require('../../../commonFunctions/UserAuth');
let getNews = require('./getNews');
let getVideos = require('./getVideos');

router.get('/news-by-category', upload.none(), (req, res) => {
  
  let category_id = parseInt(req.query.category);
  let brand_id = parseInt(req.query.brand);
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);

  UserAuth(req, res, async (status) => {
    if(status){
      
      let getVideosData = await getVideos(page, size, category_id, brand_id);
      let getNewsData = await getNews(page, size, category_id, brand_id);

      let AllNewsData = _.sortBy({ ...getNewsData, ...getVideosData }, {'posted_on': 'desc'});

      // Pagination Logic
      // let remaining = 50 - (page * size) > 0 ? 50 - (page * size) : 0;
      let pagination = {
        nextPageUrl: (AllNewsData.length === 0) ? '' : `${config.APP_URL}/news-by-category?category=${category_id}&brand=${brand_id}&page=${page + 1}&size=${size}`,
        prevPageUrl: page === 1 ? '' : `${config.APP_URL}/news-by-category?category=${category_id}&brand=${brand_id}&page=${page - 1}&size=${size}`,
        // totalRows: 50,
        // totalPages: Math.ceil(50 / size),
        // remaining: remaining
      }


      let result = {
        status: 200,
        data: AllNewsData,
        pagination: pagination
      }

      res.status(200).send(result);
    }
  })
});

module.exports = router;