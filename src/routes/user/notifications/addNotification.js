let express = require('express');
let multer = require('multer');
let axios = require('axios');

let upload = multer();
let router = express.Router();

let AdminAuth = require('../../../commonFunctions/AdminAuth');
let vt_notifications = require('../../../model/vt_notifications');

router.post('/add-notification', upload.none(), (req, res) => {
  AdminAuth(req, res, async (status) => {
    if(status){
      let body = req.body;
      vt_notifications.create({ payload: JSON.stringify(body), notify_to: 'all' })
      .then((data) => {
        if(data !== null){
          let notification_body = { ...body, to: "/topics/news", data: {...body.data, notification_id: data.null }, notification: {...body.notification, icon: 'notification_icon'} };
          
          axios({
            method: 'POST',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers:{
              'Authorization': 'key=authorization_key',
              'Content-Type': 'application/json'
            },
            data: notification_body
          })
          .then((data) => {
            res.send({ status: 200, message: 'Notification Sent!' });
          })
          .catch(() => {
            res.send({ status: 401, message: 'Notification Not Sent!' });
          })

        }
      })
    }
  })
});

module.exports = router;
