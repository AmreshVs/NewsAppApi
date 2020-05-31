let express = require('express');
let multer = require('multer');
let { Op } = require('sequelize');

let upload = multer();
let router = express.Router();

let UserAuth = require('../../../commonFunctions/UserAuth');
let vt_pdfs = require('../../../model/vt_pdfs');

router.get('/pdf-by-category', upload.none(), (req, res) => {

  let category_id = parseInt(req.query.category);
  let brand_id = parseInt(req.query.brand);

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

  UserAuth(req, res, async (status) => {
    if(status){
      await vt_pdfs.findAll({
        order: [
          ['created_at', 'DESC']
        ],
        limit: 10,
        where: {
          ...where
        }
      })
        .then((pdfData) => {
          if (pdfData !== null) {
            var data = pdfData.map((pdf) => {
              return {
                id: pdf.id,
                featured_img: pdf.featured_img,
                url: pdf.url,
              }
            })
          }
          res.send({ status: 200, data: data });
        })
        .catch((err) => {
          console.log(err);
        })
    }
  })
});

module.exports = router;