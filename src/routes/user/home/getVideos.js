let vt_videos = require('../../../model/vt_videos');
let vt_comments = require('../../../model/vt_comments');

const getVideos = async (page, size) => {
  // Returns rows that match the condition and the total row counts aswell
  return await vt_videos.findAll({
    limit: size,
    offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
    order: [
      ['created_at', 'DESC']
    ],
  })
    .then(async (videosData) => {
      let videos = {};
      if (videosData !== null) {
        for(let video of videosData){
          videos['v'+video.id] = {
            type: 'videos',
            id: video.id,
            url: video.url,
            featured_img: video.featured_img,
            title: video.title,
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

// const getComments = async (id) => {
//   return await vt_comments.count({
//     where: {
//       id: id
//     }
//   })
//   .then((data) => {
//     return data;
//   })
// }

async function getComments(id){
  return await vt_comments.findAll({
    where:{
      comment_type: 'post',
      reply_to: 'video',
      reply_id: id
    },
  })
  .then(async (data) => {
    let count = 0;
    let innerCommentsCount = 0;
    for(let [index, comment] of data.entries()){
      innerCommentsCount = await getInnerComments(comment.id);
      count += innerCommentsCount + 1;
    }
    return count;
  })
}

async function getInnerComments(id){
  return await vt_comments.findAll({
    where:{
      comment_type: 'video',
      reply_to: 'comment',
      reply_id: id
    },
  })
  .then((data) => {
    let innerCount = 0;
    for(let item of data){
      innerCount++;
    }
    return innerCount;
  })
}

module.exports = getVideos;