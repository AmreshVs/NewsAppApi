let vt_comments = require('../../../model/vt_comments');

const getNews = async () => {

  // Returns rows that match the condition and the total row counts aswell
  return await vt_comments.findAll({
    limit: 5,
    order: [
      ['posted_at', 'DESC']
    ],
  })
    .then(async (comments) => {
      if (comments !== null) {
        return comments.map((comment) => {
          return {
            id: comment.id,
            comment: comment.comment,
            posted_on: comment.posted_at
          }
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })
}

module.exports = getNews;