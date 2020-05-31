const { Op } = require("sequelize");
let moment = require('moment');
let vt_pdfs = require('../../../model/vt_pdfs');

const getLatestPdfs = async () => {

  // Returns rows that match the condition
  return await vt_pdfs.findAll({
    order: [
      ['created_at', 'DESC']
    ],
    limit: 10
  })
    .then((pdfData) => {
      if (pdfData !== null) {
        return pdfData.map((pdf) => {
          return {
            id: pdf.id,
            featured_img: pdf.featured_img,
            url: pdf.url,
          }
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })
}

module.exports = getLatestPdfs;