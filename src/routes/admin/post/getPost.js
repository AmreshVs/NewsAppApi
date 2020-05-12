let express = require('express');
let multer = require('multer');

let vt_posts = require('../../../model/vt_posts');
let vt_comments = require('../../../model/vt_comments');
let vt_users = require('../../../model/vt_users');
let AdminAuth = require('../../../commonFunctions/AdminAuth');

let upload = multer();
let router = express.Router();

router.get('/get-post', upload.none(), (req, res) => {
  
  let post_id = req.query.id;
  
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, (status) => {
    if(status){
      vt_posts.findOne({
        where:{
          id: post_id
        },
      })
        .then(async (data) => {
          
          let {id, title, content, categories, tags, brands, featured_img, created_by, created_at, updated_at} = data;

          let comments = await getComments(id);
          
          let result = {
            id: id,
            featured_img: featured_img,
            title: title,
            content: content,
            categories: categories,
            tags: tags,
            brands: brands,
            created_by: created_by,
            created_at: created_at,
            updated_at: updated_at
          }

          if(data !== null) {
            res.status(200).send({ status: 200, message: '', data: result, comments });
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

async function getComments(id){
  let comments = [];
  // Adding Foreign Key Association with vt_int_users to get the name of the user
  const creator = vt_comments.belongsTo(vt_users, { foreignKey: 'user_id' });
  return await vt_comments.findAll({
    where:{
      reply_to: 'post',
      reply_id: id
    },
    include: [creator]
  })
  .then(async (data) => {
    for(let i = 0; i< data.length; i++){
      let commentItem = {
        id: data[i].id,
        comment: data[i].comment,
        comment_type: data[i].comment_type,
        reply_to: data[i].reply_to,
        reply_id: data[i].reply_id,
        posted_by: data[i].vt_user.fullname,
        posted_at: data[i].posted_at,
        updated_at: data[i].updated_at,
        reply_comments: await getInnerComments(data[i].id)
      }
      comments[i] = commentItem;
    }
    return comments;
  })
}

async function getInnerComments(id, fn){
  let comments = [];
  // Adding Foreign Key Association with vt_int_users to get the name of the user
  const creator = vt_comments.belongsTo(vt_users, { foreignKey: 'user_id' });
  return await vt_comments.findAll({
    where:{
      reply_to: 'comment',
      reply_id: id
    },
    include: [creator]
  })
  .then((data) => {
    data.map((item, cindex) => {
      let commentItem = {
        id: item.id,
        comment: item.comment,
        comment_type: item.comment_type,
        reply_to: item.reply_to,
        reply_id: item.reply_id,
        posted_by: item.vt_user.fullname,
        posted_at: item.posted_at,
        updated_at: item.updated_at
      }
      comments[cindex] = commentItem;
    })
    return comments;
  })
}

module.exports = router;