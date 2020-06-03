let vt_news = require('../../../model/vt_news');

const getNews = async () => {

  // Returns rows that match the condition and the total row counts aswell
  return await vt_news.findAll({
    limit: 5,
    order: [
      ['created_at', 'DESC']
    ],
  })
    .then(async (newsData) => {
      if (newsData !== null) {
        return newsData.map((news) => {
          return {
            id: news.id,
            featured_img: news.featured_img,
            title: news.title,
            posted_on: news.created_at
          }
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })
}

module.exports = getNews;