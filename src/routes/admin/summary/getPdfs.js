let vt_pdfs = require('../../../model/vt_pdfs');

const getPdfs = async () => {

  // Returns rows that match the condition
  return await vt_pdfs.findAll({
    limit: 5,
    order: [
      ['created_at', 'DESC']
    ],
  })
    .then((data) => {
      if (data !== null) {
        return data.map((item) => {
          return {
            id: item.id,
            featured_img: item.featured_img,
            title: item.title,
            posted_on: item.created_at
          }
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })
};

module.exports = getPdfs;