let express = require('express');
let multer = require('multer');

let upload = multer();
let router = express.Router();

let UserAuth = require('../../../commonFunctions/UserAuth');
let vt_notifications = require('../../../model/vt_notifications');
let getNotificationViewed = require('../../../commonFunctions/getNotificationViewed');

router.get('/list-notifications', upload.none(), (req, res) => {
  
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);

  UserAuth(req, res, async (status) => {
    if(status){
      let notification_viewed = await getNotificationViewed(req);

      vt_notifications.findAndCountAll({
        limit: size,
        offset: page === 1 ? 0 : page === 2 ? size : (page - 1) * size,
        order: [
          ['created_at', 'DESC']
        ],
        where:{
          notify_to: 'all'
        }
      })
      .then((notifications) => {
        if(notifications !== null){
          // Pagination Logic
          let remaining = notifications.count - (page * size) > 0 ? notifications.count - (page * size) : 0;
          let pagination = {
            nextPageUrl: remaining === 0 ? '' : `${config.APP_URL}/list-notifications?page=${page + 1}&size=${size}`,
            prevPageUrl: page === 1 ? '' : `${config.APP_URL}/list-notifications?page=${page - 1}&size=${size}`,
            totalRows: notifications.count,
            totalPages: Math.ceil(notifications.count / size),
            remaining: remaining
          }

          let data = notifications.rows.map((item) => {

            let payload = JSON.parse(item.payload);
            let notification = payload.notification;
            let data = payload.data;
            let users_viewed = notification_viewed !== '' ? notification_viewed.split(',') : [];
            let notify_viwed = users_viewed.includes(`${item.id}`);

            return {
              id: item.id,
              title: notification.title,
              image: notification.image,
              posted_on: item.created_at,
              notify_viewed: notify_viwed,
              data: data
            }
          })

          res.status(200).send({ status: 200, message: '', data: data, pagination: pagination });
        }
      })

    }
  })
});

module.exports = router;