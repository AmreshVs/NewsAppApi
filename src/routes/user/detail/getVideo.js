let express = require('express');
let multer = require('multer');
let moment = require('moment');

let vt_videos = require('../../../model/vt_videos');
let vt_comments = require('../../../model/vt_comments');
let vt_users = require('../../../model/vt_users');
let vt_favourites = require('../../../model/vt_favourites');
let UserAuth = require('../../../commonFunctions/UserAuth');
let getUserId = require('../../../commonFunctions/getUserId');

let upload = multer();
let router = express.Router();

router.get('/get-video-detail', upload.none(), async (req, res) => {

  let video_id = req.query.id;
  let user_id = await getUserId(req);

  // Authenticate Admin with token and then proceed
  UserAuth(req, res, (status) => {
    if (status) {
      vt_videos.findOne({
        where: {
          id: video_id
        },
      })
        .then(async (data) => {

          if (data === null) {
            res.status(401).send({ status: 401, message: 'No video found!' });
          }

          if (data !== null) {
            let { id, title, content, categories, tags, brands, featured_img, url, created_by, created_at, updated_at } = data;

            // Get comments based on video ID
            let comments = await getComments(id);
            let result = {
              id: id,
              title: title,
              url: url,
              featured_img: featured_img,
              content: content,
              categories: categories,
              tags: tags,
              brands: brands,
              is_favourite: await getIsfavourite(user_id, id),
              created_by: created_by,
              created_at: created_at,
              updated_at: updated_at,
              comments: comments
            }

            res.status(200).send({ status: 200, message: '', data: result });
          }

        })
        .catch((err) => {
          console.log(err);
        })
    }
  })
});

async function getComments(id) {
  let comments = [];
  // Adding Foreign Key Association with vt_int_users to get the name of the user
  const creator = vt_comments.belongsTo(vt_users, { foreignKey: 'user_id' });
  return await vt_comments.findAll({
    where: {
      comment_type: 'post',
      reply_to: 'video',
      reply_id: id
    },
    include: [creator]
  })
    .then(async (data) => {
      // Form an Array of objects with innerComments
      for (let [index, comment] of data.entries()) {
        let commentItem = {
          id: comment.id,
          comment: comment.comment,
          comment_type: comment.comment_type,
          reply_to: comment.reply_to,
          reply_id: comment.reply_id,
          posted_by: comment.vt_user.fullname,
          posted_at: moment(comment.posted_at).format('D/M/YYYY'),
          updated_at: comment.updated_at,
          reply_comments: await getInnerComments(comment.id)
        }
        comments[index] = commentItem;
      }
      return comments;
    })
}

async function getInnerComments(id) {
  let comments = [];
  // Adding Foreign Key Association with vt_int_users to get the name of the user
  const creator = vt_comments.belongsTo(vt_users, { foreignKey: 'user_id' });
  return await vt_comments.findAll({
    where: {
      comment_type: 'post',
      reply_to: 'comment',
      reply_id: id
    },
    include: [creator]
  })
    .then((data) => {
      // Get inner comments, consolidate and return
      data.map((item, cindex) => {
        let commentItem = {
          id: item.id,
          comment: item.comment,
          comment_type: item.comment_type,
          reply_to: item.reply_to,
          reply_id: item.reply_id,
          posted_by: item.vt_user.fullname,
          posted_at: moment(item.posted_at).format('D/M/YYYY'),
          updated_at: item.updated_at
        }
        comments[cindex] = commentItem;
      })
      return comments;
    })
}

async function getIsfavourite(user_id, id){
  return vt_favourites.findOne({
    where:{
      user_id: user_id
    }
  })
  .then((favourite) => {
    if(favourite !== null){
      let videos_fav = (favourite.videos).split(',');
      if(videos_fav.includes(`${id}`)){
        return true;
      }
      return false;
    }
    else{
      return false;
    }
  })
}

module.exports = router;