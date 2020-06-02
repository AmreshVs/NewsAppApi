let vt_news = require('../../../model/vt_news');
let vt_comments = require('../../../model/vt_comments');

const getNews = async (page, size) => {

  // Returns rows that match the condition and the total row counts aswell
  return await vt_news.findAll({
    limit: size,
    offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
    order: [
      ['created_at', 'DESC']
    ],
  })
    .then(async (newsData) => {
      let newsAll = {};
      if (newsData !== null) {
        for(let news of newsData){
          newsAll['n'+news.id] = {
            type: 'news',
            id: news.id,
            featured_img: news.featured_img,
            title: news.title,
            comments: await getComments(news.id),
            posted_on: news.updated_at !== null ? news.updated_at : news.created_at !== null ? news.created_at : '-'
          }
        }
        return newsAll;
      }
    })
    .catch((err) => {
      console.log(err);
    })
}

// const getComments = async (id) => {
//   return await vt_comments.count({
//     where: {
//       reply_to: 'news',
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
      reply_to: 'news',
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
      comment_type: 'post',
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

module.exports = getNews;