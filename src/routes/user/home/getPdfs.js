let vt_pdfs = require('../../../model/vt_pdfs');

const getPdfs = async (page, size) => {

  // Returns rows that match the condition
  return await vt_pdfs.findAll({
    limit: size,
    offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
    order: [
      ['id', 'ASC']
    ],
  })
    .then((data) => {
      if (data !== null) {
        return data.map((item) => {
          return {
            type: 'pdfs',
            id: item.id,
            featured_img: item.featured_img,
            title: item.title,
            posted_on: item.updated_at !== null ? item.updated_at : item.created_at !== null ? item.created_at : '-'
          }
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })
};

module.exports = getPdfs;