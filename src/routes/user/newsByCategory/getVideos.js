let { Op } =  require('sequelize');

let vt_videos = require('../../../model/vt_videos');
let vt_comments = require('../../../model/vt_comments');

const getVideos = async (page, size, category_id, brand_id) => {

  var where = null;
  if(brand_id){
    where = {
      ...where,
      brands: {
        [Op.like]: `%${brand_id}%`
      }
    }
  }

  if(category_id){
    where = {
      ...where,
      categories: {
        [Op.like]: `%${category_id}%`
      }
    }
  }


  // Returns rows that match the condition and the total row counts aswell
  return await vt_videos.findAll({
    limit: size,
    offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
    order: [
      ['created_at', 'DESC']
    ],
    where:{
      ...where
    }
  })
    .then(async (videosData) => {
      let videos = {};
      if (videosData !== null) {
        for (let video of videosData) {

          videos['v' + video.id] = {
            type: 'videos',
            id: video.id,
            url: video.url,
            featured_img: video.featured_img,
            title: video.title,
            brands: video.brands,
            comments: await getComments(video.id),
            posted_on: video.updated_at !== null ? video.updated_at : video.created_at !== null ? video.created_at : '-'
          }
        }
        return videos;
      }
    })
    .catch((err) => {
      console.log(err);
    })
};

const getComments = async (id) => {
  return await vt_comments.count({
    where: {
      id: id
    }
  })
    .then((data) => {
      return data;
    })
}

module.exports = getVideos;