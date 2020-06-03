let express = require('express');
let multer = require('multer');
let upload = multer();
let router = express.Router();
let moment = require('moment');

let UserAuth = require('../../../commonFunctions/UserAuth');
let vt_users = require('../../../model/vt_users');
let vt_notifications = require('../../../model/vt_notifications');
let vt_favourites = require('../../../model/vt_favourites');

router.get('/view-profile', upload.none(), async (req, res) => {

  // Authenticate User with token and then proceed
  UserAuth(req, res, async (status) => {
    if(status){
      vt_users.findOne({
        where:{
          token: req.headers.authorization
        }
      })
      .then(async (user) => {
        if(user !== null){

          let notification_count = await getNotificationCount();
          let user_notification = user.notifications_viewed !== '' && user.notifications_viewed !== null ? (user.notifications_viewed.split(',')).length : 0;
          let unread_notification = notification_count - user_notification;

          let data = {
            fullname: user.fullname,
            mobile: user.mobile,
            cityState: user.citystate,
            created_on: moment(user.created_at).format('DD/MM/YYYY'),
            unread_notification: unread_notification,
            total_favourites: await favouriteCounts(user.id)
          }

          res.status(200).send({ status: 200, message: 'Success!', data: data });
        }
      })
    }
  })
});

module.exports = router;

const getNotificationCount = async () => {
  return await vt_notifications.count({
    where: {
      notify_to: 'all'
    }
  })
  .then((count) => {
    return count;
  })
}

const favouriteCounts = async (id) => {
  return await vt_favourites.findOne({
    where:{
      user_id: id
    }
  })
  .then((favourite) => {
    let news = favourite.news !== '' ? (favourite.news.split(',')).length : 0;
    let videos = favourite.videos !== '' ? (favourite.videos.split(',')).length : 0;
    let pdfs = favourite.pdfs !== '' ? (favourite.pdfs.split(',')).length : 0;
    return news + videos + pdfs;
  })
}