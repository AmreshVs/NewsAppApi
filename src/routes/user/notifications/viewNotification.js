let express = require('express');
let multer = require('multer');

let upload = multer();
let router = express.Router();

let UserAuth = require('../../../commonFunctions/UserAuth');
let vt_users = require('../../../model/vt_users');

router.get('/view-notification', upload.none(), (req, res) => {
  UserAuth(req, res, async (status) => {
    if(status){
      let id = parseInt(req.query.id);

      vt_users.findOne({
        where:{
          token: req.headers.authorization,
        }
      })
      .then((user) => {

        let notify_viwed = user.notifications_viewed !== '' ? user.notifications_viewed.split(',') : [];

        if(!notify_viwed.includes(`${id}`)){
          notify_viwed.push(id);
          user.update({
            notifications_viewed: notify_viwed.join(',')
          })
          .then(() => {
            res.status(200).send({ status: 200, message: 'Notification Viewed!' });
          })
          .catch(() => {
            res.status(401).send({ status: 401, message: 'Notification View Error' });
          })
        }
        else{
          res.status(200).send({ status: 200, message: 'Notification Already Viewed!' });
        }
      })
    }
  })
});

module.exports = router;