let express = require('express');
let multer = require('multer');

let vt_posts = require('../../../model/vt_posts');
let vt_int_users = require('../../../model/vt_int_users');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.post('/new-post', upload.none(), async (req, res) => {

  let body = req.body;
  let token = req.headers.authorization;
  let post_id = body.id;

  // Join Arrays with comma
  let categories = (body.categories).join(",");
  let brands = (body.brands).join(",");
  let created_by = await getUserId();

  let DbData = {
    title: body.title,
    content: body.content,
    categories: categories,
    tags: body.tags,
    brands: brands,
    featured_img: body.featured_img,
    created_by: created_by,
    created_at: new Date(),
    updated_at: new Date()
  }

  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, (status) => {
    if(status){
      // If Post ID is present Update post, else create new post
      if (post_id) {
        vt_posts.findOne({
          where: {
            id: post_id
          }
        })
          .then((data) => {
            if (data !== null) {
              data.update({
                ...DbData,
                updated_at: new Date()
              })
                .then(() => {
                  res.send({ status: 200, message: 'Post Updated!' });
                })
                .catch(() => {
                  res.send({ status: 401, message: 'Failed Updating post' });
                })
            }
            else {
              res.send({ status: 401, message: 'No such post with ID : ' + post_id });
            }
          })
      }
      else {
        vt_posts.create(DbData)
          .then(() => {
            res.send({ status: 200, message: 'Post created!' });
          })
          .catch(() => {
            res.send({ status: 401, message: 'Failed Creating post' });
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
});

module.exports = router;