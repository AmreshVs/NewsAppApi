let express = require('express');
let multer = require('multer');
let _ = require('lodash');

let config = require('../../../config/config');
let vt_pdfs = require('../../../model/vt_pdfs');
let vt_categories = require('../../../model/vt_categories');
let vt_brands = require('../../../model/vt_brands');
let vt_int_users = require('../../../model/vt_int_users');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.get('/get-all-pdf', upload.none(), async (req, res) => {

  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);

  // Run category once
  global.category_data = await getCategory();
  global.brand_data = await getBrand();

  // Adding Foreign Key Association with vt_int_users to get the name of the user
  const creator = vt_pdfs.belongsTo(vt_int_users, { foreignKey: 'created_by' });

  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, (status) => {
    if(status){
      // Returns rows that match the condition and the total row counts aswell
      vt_pdfs.findAndCountAll({
        limit: size,
        offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
        order: [
          ['created_at', 'DESC']
        ],
        include: [creator]
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

            data = data.rows.map((item) => {

              // Send in the Categories and brands Id with comma seperated (1,2) to Category and brand names (Media, Breaking News)
              let categories = joinCategory(item.categories);
              let brands = joinBrand(item.brands);
              
              return {
                id: item.id,
                featured_img: item.featured_img,
                url: item.url,
                title: item.title,
                categories: categories,
                brands: brands,
                created_by: item.vt_int_user.username,
                updated_on: item.updated_at !== null ? item.updated_at : item.created_at !== null ? item.created_at : '-'
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

function getBrand() {
  return vt_brands.findAll()
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

function joinBrand(brands){
  let brands_split = brands.split(',');
  let brand_array = [];
  brands_split.map((item) => {
    let index = _.findKey(global.brand_data, { 'id': parseInt(item) });
    brand_array.push(global.brand_data[index].name);
  })
  return brand_array;
}

module.exports = router;