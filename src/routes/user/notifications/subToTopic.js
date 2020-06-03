let express = require('express');
let multer = require('multer');
let axios = require('axios');

let upload = multer();
let router = express.Router();

let UserAuth = require('../../../commonFunctions/UserAuth');

router.post('/sub-to-topic', upload.none(), (req, res) => {

  let token = req.query.token;

  UserAuth(req, res, async (status) => {
    if (status) {
      axios({
        method: 'POST',
        url: 'https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/news',
        headers: {
          'Authorization': 'key=AAAA7Bw8-Ws:APA91bHMXUIvrcBtt_f8z8TM2cxcZ4iYoSrPR4v8b9A0I6wVQD80rHcHQOkhAFGHqLdGxX6ylHrcYxHN8TngQh-IcP6v14i6E585za2cS8SG6eoIxAbJoOVK8hEHAXZFxSqYrvlPg8nP',
          'Content-Type': 'application/json'
        },
      })
        .then((data) => {
          res.send({ status: 200, message: 'Subscribed' });
        })
        .catch(() => {
          res.send({ status: 401, message: 'Subscribe Error!' });
        })
    }
  })
});

module.exports = router;