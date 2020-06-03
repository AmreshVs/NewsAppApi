let vt_videos = require('../../../model/vt_videos');

const getVideos = async () => {
  // Returns rows that match the condition and the total row counts aswell
  return await vt_videos.findAll({
    limit: 5,
    order: [
      ['created_at', 'DESC']
    ],
  })
    .then(async (videosData) => {
      if (videosData !== null) {
        return videosData.map((video) => {
          return {
            id: video.id,
            url: video.url,
            featured_img: video.featured_img,
            title: video.title,
            posted_on: video.created_at
          }
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })
};

module.exports = getVideos;