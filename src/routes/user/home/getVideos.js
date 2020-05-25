let vt_videos = require('../../../model/vt_videos');

const getVideos = async (page, size) => {
  // Returns rows that match the condition and the total row counts aswell
  return await vt_videos.findAndCountAll({
    limit: size,
    offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
    order: [
      ['created_at', 'DESC']
    ],
  })
    .then((videosData) => {
      let videos = {};
      if (videosData !== null) {
        for(let item of videosData.rows){
          videos['v'+item.id] = {
            type: 'videos',
            id: item.id,
            url: item.url,
            featured_img: item.featured_img,
            title: item.title,
            posted_on: item.updated_at !== null ? item.updated_at : item.created_at !== null ? item.created_at : '-'
          }
        }
        return videos;
      }
    })
    .catch((err) => {
      console.log(err);
    })
};

module.exports = getVideos;