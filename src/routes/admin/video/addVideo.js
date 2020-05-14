let express = require('express');
let multer = require('multer');

let vt_videos = require('../../../model/vt_videos');
let vt_int_users = require('../../../model/vt_int_users');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.post('/add-video', upload.none(), async (req, res) => {

  let body = req.body;
  let token = req.headers.authorization;
  let video_id = body.id;

  // Join Arrays with comma
  let categories = (body.categories).join(",");
  let brands = (body.brands).join(",");
  let created_by = await getUserId();

  let DbData = {
    title: body.title,
    description: body.description,
    categories: categories,
    tags: body.tags,
    brands: brands,
    featured_img: body.featured_img,
    url: body.url,
    created_by: created_by,
    created_at: new Date(),
    updated_at: new Date()
  }

  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, (status) => {
    if(status){
      // If PDF ID is present Update post, else create new PDF
      if (video_id) {
        vt_videos.findOne({
          where: {
            id: video_id
          }
        })
          .then((data) => {
            if (data !== null) {
              data.update({
                ...DbData,
                updated_at: new Date()
              })
                .then(() => {
                  res.send({ status: 200, message: 'Video Updated!' });
                })
                .catch(() => {
                  res.send({ status: 401, message: 'Failed Updating Video' });
                })
            }
            else {
              res.send({ status: 401, message: 'No such Video post with ID : ' + video_id });
            }
          })
      }
      else {
        vt_videos.create(DbData)
          .then(() => {
            res.send({ status: 200, message: 'Video created!' });
          })
          .catch(() => {
            res.send({ status: 401, message: 'Failed Creating Video' });
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