let express = require('express');
let multer = require('multer');

let vt_brands = require('../../../model/vt_brands');
let vt_int_users = require('../../../model/vt_int_users');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.post('/add-brand', upload.none(), async (req, res) => {

  let body = req.body;
  let token = req.headers.authorization;
  let brand_id = body.id;

  // Get user ID
  let created_by = await getUserId();

  let DbData = {
    name: body.name,
    created_by: created_by,
    created_at: new Date()
  }

  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, async (status) => {
    if(status){
      // Check if brand name already exist or not
      if(await brandCheck()){

        // If brand ID is present Update brand, else create new brand
        if (brand_id) {
          vt_brands.findOne({
            where: {
              id: brand_id
            }
          })
            .then((data) => {
              if (data !== null) {
                data.update({
                  ...DbData,
                  updated_at: new Date()
                })
                  .then(() => {
                    res.send({ status: 200, message: 'Brand Updated!' });
                  })
                  .catch(() => {
                    res.send({ status: 401, message: 'Failed Updating Brand' });
                  })
              }
              else {
                res.send({ status: 401, message: 'No such brand with ID : ' + brand_id });
              }
            })
        }
        else {
          vt_brands.create(DbData)
            .then(() => {
              res.send({ status: 200, message: `Brand ${body.name} created!` });
            })
            .catch(() => {
              res.send({ status: 401, message: 'Failed Brand Category' });
            })
        }
      }
    }
  })


  function getUserId() {
    // Get the User Id with the Token
    return vt_int_users.findOne({
      where: {
        token: token
      }
    })
      .then((data) => {
        return data.id;
      })
  }

  function brandCheck(){
    return vt_brands.findOne({
      where: {
        name: body.name
      }
    })
      .then((data) => {
        if(data !== null){
          res.send({ status: 401, message: 'Brand Already exist!' });
          return false;
        }
        else{
          return true;
        }
      })
  }
});

module.exports = router;