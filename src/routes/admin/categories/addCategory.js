let express = require('express');
let multer = require('multer');

let vt_categories = require('../../../model/vt_categories');
let vt_int_users = require('../../../model/vt_int_users');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.post('/add-category', upload.none(), async (req, res) => {

  let body = req.body;
  let token = req.headers.authorization;
  let category_id = body.id;

  // Get user ID
  let created_by = await getUserId();

  let DbData = {
    name: body.name,
    created_by: created_by,
    created_at: new Date()
  }

  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, async () => {

    // Check if category name already exist or not
    if(await categoryCheck()){

      // If Category ID is present Update category, else create new category
      if (category_id) {
        vt_categories.findOne({
          where: {
            id: category_id
          }
        })
          .then((data) => {
            if (data !== null) {
              data.update({
                ...DbData,
                updated_at: new Date()
              })
                .then(() => {
                  res.send({ status: 200, message: 'Category Updated!' });
                })
                .catch(() => {
                  res.send({ status: 401, message: 'Failed Updating Category' });
                })
            }
            else {
              res.send({ status: 401, message: 'No such category with ID : ' + category_id });
            }
          })
      }
      else {
        vt_categories.create(DbData)
          .then(() => {
            res.send({ status: 200, message: `Category ${body.name} created!` });
          })
          .catch(() => {
            res.send({ status: 401, message: 'Failed Creating Category' });
          })
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

  function categoryCheck(){
    return vt_categories.findOne({
      where: {
        name: body.name
      }
    })
      .then((data) => {
        if(data !== null){
          res.send({ status: 401, message: 'Category Already exist!' });
          return false;
        }
        else{
          return true;
        }
      })
  }
});

module.exports = router;