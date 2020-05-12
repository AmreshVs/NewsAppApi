let express = require('express');
let multer = require('multer');

let vt_comments = require('../../model/vt_comments');
let UserAuth = require('../../commonFunctions/UserAuth');

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
    is_verified: 0,
    posted_at: new Date()
  }
  
  // Authenticate User with token and then proceed
  UserAuth(req, res, (status) => {
    if(status){
      vt_comments.create(dbData)
        .then(() => {
          res.status(200).send({ status: 200, message: 'Comment will be added once verified!'});
        })
        .catch(() => {
          res.status(401).send({ status: 200, message: 'Error posting comment'});
        })
    }
  })
});

module.exports = router;