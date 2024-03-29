let { Op } = require('sequelize');

let vt_news = require('../../../model/vt_news');
let vt_comments = require('../../../model/vt_comments');

const getNews = async (page, size, category_id, brand_id) => {

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
  return await vt_news.findAll({
    limit: size,
    offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
    order: [
      ['created_at', 'DESC']
    ],
    where: {
      ...where
    }
  })
    .then(async (newsData) => {
      let newsAll = {};
      if (newsData !== null) {
        for (let news of newsData) {
          newsAll['n' + news.id] = {
            type: 'news',
            id: news.id,
            featured_img: news.featured_img,
            brands: news.brands,
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

module.exports = getNews;