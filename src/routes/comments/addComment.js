let express = require('express');
let multer = require('multer');

let vt_comments = require('../../model/vt_comments');
let UserOrAdminAuth = require('../../commonFunctions/UserOrAdminAuth');

let upload = multer();
let router = express.Router();

router.post('/add-comment', upload.none(), (req, res) => {
  
  let body = req.body;
  let dbData = {
    user_id: body.user_id,
    comment: body.comment,
    comment_type: body.comment_type,
    reply_to: body.reply_to,
    reply_id: body.reply_id,
    is_verified: body.is_verified,
    posted_at: new Date()
  }
  
  // Authenticate User with token and then proceed
  UserOrAdminAuth(req, res, (status) => {
    if(status){
      vt_comments.create(dbData)
        .then(() => {
          res.status(200).send({ status: 200, message: body.is_verified === 1 ? 'Comment Added' : 'Comment will be added once verified!' });
        })
        .catch((err) => {
          console.log(err);
          res.status(401).send({ status: 401, message: 'Error posting comment' });
        })
    }
  })
});

module.exports = router;