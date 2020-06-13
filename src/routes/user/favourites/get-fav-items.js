let express = require('express');
let multer = require('multer');
let { Op } = require('sequelize');
let _ = require('lodash');

let config = require('../../../config/config');
let UserAuth = require('../../../commonFunctions/UserAuth');
let vt_favourites = require('../../../model/vt_favourites');
let vt_news = require('../../../model/vt_news');
let vt_videos = require('../../../model/vt_videos');
let vt_pdfs = require('../../../model/vt_pdfs');
let getUserId = require('../../../commonFunctions/getUserId');

let upload = multer();
let router = express.Router();

router.get('/get-fav-items', upload.none(), async (req, res) => {

  global.page = parseInt(req.query.page);
  global.size = parseInt(req.query.size);
  let user_id = await getUserId(req);
  
  UserAuth(req, res, async (status) => {
    if (status) {
      let { news, videos, pdfs } = await getFavourites(user_id);
      let newsData = await getNews(news);
      let videosData = await getVideos(videos);
      let pdfsData = await getPdfs(pdfs);
      
      let AllNewsData = _.sortBy({ ...newsData, ...videosData, ...pdfsData }, {'title': 'desc'});
      
       // Pagination
      let pagination = {
        nextPageUrl: (AllNewsData.length === 0) ? '' : `${config.APP_URL}/home?page=${page + 1}&size=${size}`,
        prevPageUrl: page === 1 ? '' : `${config.APP_URL}/home?page=${page - 1}&size=${size}`,
      }

      let result = {
        status: 200,
        data: AllNewsData,
        pagination: pagination
      }

      res.send(result);
    }
  })
});

function getFavourites(user_id){
  return vt_favourites.findOne({
    where:{
      user_id: user_id
    }
  })
  .then((favourite) => {

    if(favourite !== null){
      let news = (favourite.news).split(',');
      let videos = (favourite.videos).split(',');
      let pdfs = (favourite.pdfs).split(',');

      return { news, videos, pdfs };
    }
    else{
      return { news: [], videos: [], pdfs: [] };
    }
  })
}

function getNews(news){
  return vt_news.findAll({
    limit: global.size,
    offset: global.page === 1 ? 0 : global.page === 2 ? global.size : (global.page - 1) * global.size,
    where:{
      id:{
        [Op.in]: news
      }
    }
  })
  .then((newsItems) => {
    if(newsItems !== null){
      let newsAll = {};
      for(let news of newsItems){
        newsAll['n'+news.id] = {
          type: 'news',
          id: news.id,
          featured_img: news.featured_img,
          title: news.title,
        }
      }
      return newsAll;
    }
  })
}

function getVideos(videos){
  return vt_videos.findAll({
    limit: global.size,
    offset: global.page === 1 ? 0 : global.page === 2 ? global.size : (global.page - 1) * global.size,
    where:{
      id:{
        [Op.in]: videos
      }
    }
  })
  .then((videoItems) => {
    if(videoItems !== null){
      let videoAll = {};
      for(let video of videoItems){
        videoAll['v'+video.id] = {
          type: 'video',
          id: video.id,
          featured_img: video.featured_img,
          url: video.url,
          title: video.title,
        }
      }
      return videoAll;
    }
  })
}

function getPdfs(pdfs){
  return vt_pdfs.findAll({
    limit: global.size,
    offset: global.page === 1 ? 0 : global.page === 2 ? global.size : (global.page - 1) * global.size,
    where:{
      id:{
        [Op.in]: pdfs
      }
    }
  })
  .then((pdfItems) => {
    if(pdfItems !== null){
      let pdfAll = {};
      for(let pdf of pdfItems){
        pdfAll['p'+pdf.id] = {
          type: 'pdf',
          id: pdf.id,
          featured_img: pdf.featured_img,
          url: pdf.url,
          title: pdf.title,
        }
      }
      return pdfAll;
    }
  })
}

module.exports = router;