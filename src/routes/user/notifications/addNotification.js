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
          let notification_body = { ...body, data: {...body.data, notification_id: data.null } };
          
          axios({
            method: 'POST',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers:{
              'Authorization': 'key=AAAA7Bw8-Ws:APA91bHMXUIvrcBtt_f8z8TM2cxcZ4iYoSrPR4v8b9A0I6wVQD80rHcHQOkhAFGHqLdGxX6ylHrcYxHN8TngQh-IcP6v14i6E585za2cS8SG6eoIxAbJoOVK8hEHAXZFxSqYrvlPg8nP',
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