let express = require('express');
let multer = require('multer');
let _ = require('lodash');
let moment = require('moment');

let config = require('../../../config/config');
let vt_pdfs = require('../../../model/vt_pdfs');
let vt_categories = require('../../../model/vt_categories');
let UserAuth = require('../../../commonFunctions/UserAuth');

let upload = multer();
let router = express.Router();

router.get('/get-all-user-pdf', upload.none(), async (req, res) => {

  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);

  // Run category once
  global.category_data = await getCategory();

  // Authenticate Admin with token and then proceed
  UserAuth(req, res, (status) => {
    if(status){
      // Returns rows that match the condition and the total row counts aswell
      vt_pdfs.findAndCountAll({
        limit: size,
        offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
        order: [
          ['id', 'ASC']
        ],
      })
        .then((data) => {

          if (data !== null) {
            // Pagination Logic
            let remaining = data.count - (page * size) > 0 ? data.count - (page * size) : 0;
            let pagination = {
              nextPageUrl: remaining === 0 ? '' : `${config.APP_URL}/get-all-pdf?page=${page + 1}&size=${size}`,
              prevPageUrl: page === 1 ? '' : `${config.APP_URL}/get-all-pdf?page=${page - 1}&size=${size}`,
              totalRows: data.count,
              totalPages: Math.ceil(data.count / size),
              remaining: remaining
            }

            data = data.rows.map((pdf) => {

              // Send in the Categories and brands Id with comma seperated (1,2) to Category and brand names (Media, Breaking News)
              let categories = joinCategory(pdf.categories);
              
              return {
                id: pdf.id,
                featured_img: pdf.featured_img,
                url: pdf.url,
                // categories: categories,
                posted_on: pdf.updated_at !== null ? moment(pdf.updated_at).format('D/M/YYYY') : pdf.created_at !== null ? moment(pdf.created_at).format('D/M/YYYY') : '-'
              }
            })
            res.status(200).send({ status: 200, message: '', data: data, pagination: pagination });
          }
          if (data === null) {
            res.status(401).send({ status: 401, message: 'No Post found!' });
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  })
});

function getCategory() {
  return vt_categories.findAll()
    .then((data) => {
      return data.map((item) => {
        return {
          id: item.id,
          name: item.name
        }
      })
    })
}

function joinCategory(categories){
  let categories_split = categories.split(',');
  let category_array = [];
  categories_split.map((item) => {
    let index = _.findKey(global.category_data, { 'id': parseInt(item) });
    category_array.push(global.category_data[index].name);
  })
  return category_array;
}

module.exports = router;