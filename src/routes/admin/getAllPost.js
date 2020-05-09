let express = require('express');
let multer = require('multer');

let config = require('../../config/config');
let vt_posts = require('../../model/vt_posts');
let AdminAuth = require('../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.get('/get-all-post', upload.none(), (req, res) => {

  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);
    
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, () => {
    // Returns rows that match the condition and the total row counts aswell
    vt_posts.findAndCountAll({
      limit: size,
      offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
      order:[
        ['id', 'ASC']
      ]
    })
      .then((data) => {
        if(data !== null) {

          // Pagination Logic
          let remaining = data.count - (page * size) > 0 ? data.count - (page * size) : 0;
          let pagination = {
            nextPageUrl: remaining === 0 ? '' : `${config.APP_URL}/get-all-post?page=${page + 1}&size=${size}`,
            prevPageUrl: page === 1 ? '' : `${config.APP_URL}/get-all-post?page=${page - 1}&size=${size}`,
            totalRows: data.count,
            remaining: remaining
          }

          data = data.rows.map((item) => {
            return{
              id: item.id,
              featured_img: item.featured_img,
              title: item.title,
              categories: item.categories,
              created_by: item.created_by
            }
          })
          res.status(200).send({ status: 200, message: '', data: data, pagination: pagination });
        }
        if(data === null){
          res.status(401).send({ status: 401, message: 'No Post found!' });
        }
      })
      .catch((err) => {
        console.log(err);
      })
  })
});

module.exports = router;