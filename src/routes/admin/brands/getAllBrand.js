let express = require('express');
let multer = require('multer');

let config = require('../../../config/config');
let vt_brands = require('../../../model/vt_brands');
let vt_int_users = require('../../../model/vt_int_users');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.get('/get-all-brand', upload.none(), (req, res) => {

  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);

  // Adding Foreign Key Association with vt_int_users to get the name of the user
  const creator = vt_brands.belongsTo(vt_int_users, {foreignKey: 'created_by'});
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, (status) => {
    if(status){
      // Returns rows that match the condition and the total row counts aswell
      vt_brands.findAndCountAll({
        limit: size,
        offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
        order:[
          ['id', 'ASC']
        ],
        include:[ creator ]
      })
        .then((data) => {

          if(data !== null) {

            // Pagination Logic
            let remaining = data.count - (page * size) > 0 ? data.count - (page * size) : 0;
            let pagination = {
              nextPageUrl: remaining === 0 ? '' : `${config.APP_URL}/get-all-brand?page=${page + 1}&size=${size}`,
              prevPageUrl: page === 1 ? '' : `${config.APP_URL}/get-all-brand?page=${page - 1}&size=${size}`,
              totalRows: data.count,
              remaining: remaining
            }

            data = data.rows.map((item) => {
              return{
                id: item.id,
                name: item.name,
                created_by: item.vt_int_user.username,
                created_at: item.created_at
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
    }
  })
});

module.exports = router;