let vt_news = require('../../../model/vt_news');

const getNews = async (page, size) => {

  // Returns rows that match the condition and the total row counts aswell
  return await vt_news.findAll({
    limit: size,
    offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
    order: [
      ['created_at', 'DESC']
    ],
  })
    .then((newsData) => {
      let newsAll = {};
      if (newsData !== null) {
        for(let news of newsData){
          newsAll['n'+news.id] = {
            type: 'news',
            id: news.id,
            featured_img: news.featured_img,
            title: news.title,
            // content: (news.content).replace(/<[^>]*>?/gm, '').replace(/^(.{100}[^\s]*).*/, "$1"),
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

module.exports = getNews;