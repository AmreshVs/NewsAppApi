let express = require('express');
let multer = require('multer');
let jwt = require('jsonwebtoken');

let config = require('../config/config');
let vt_users = require('../model/vt_users');

let upload = multer();
let router = express.Router();

router.post('/login', upload.none(), (req, res) => {
  // Generate token for Authentication
  let token = jwt.sign({ id: req.body.email }, config.secret);
  // let otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  let otp = 1234;

  vt_users.findOne({
    where: {
      mobile: req.body.mobile,
      is_verified: true
    }
  })
    .then((data) => {
      if (data) {
        // If no OTP present, Send OTP and Save it in DB
        if (!req.body.otp) {
          data.update({
            otp: otp
          })
          .then(() => {
            res.send({ status: 'success', message: 'OTP sent to registered mobile number' });
          })
        }
        else{
          vt_users.findOne({
            where:{
              mobile: req.body.mobile,
              otp: req.body.otp,
            }
          })
          // OTP Present and Authenticated, then update Token
          .then((data) => {
            data.update({
              token: token
            })
            .then((data) => {
              res.send({
                status: 'success',
                message: 'Login Success',
                data:{
                  user_id: data.id,
                  fullname: data.fullname,
                  citystate: data.citystate,
                  mobile: data.mobile,
                  token: data.token,
                  onesignal_id: data.onesignal_id
                }
              });
            })
          })
        }
      }
      else {
        res.send({ messae: 'Not registered! or Not verified Please signup' });
      }
    })
    .catch((err) => {
      console.log(err);
    })
});

module.exports = router;