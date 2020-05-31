const { Op } = require("sequelize");
let moment = require('moment');
let vt_pdfs = require('../../../model/vt_pdfs');

const getTodayPdfs = async () => {

  let last_posted_date = await getLastPostedDate();

  // Returns rows that match the condition
  return await vt_pdfs.findAll({
    where:{
        created_at: {
          [Op.between]: [moment(last_posted_date).utc().startOf('day'), moment(last_posted_date).utc().endOf('day')]
        }
      }
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

const getLastPostedDate = async () => {
  return await vt_pdfs.findOne({
    order: [
      ['created_at', 'DESC']
    ],
  })
  .then((pdfData) => {
    if(pdfData !== null){
      return pdfData.created_at;
    }
  })
  .catch((err) => {
    console.log(err);
  })
}

module.exports = getTodayPdfs;