let express = require('express');
let multer = require('multer');
let axios = require('axios');

let upload = multer();
let router = express.Router();
let vt_users = require('../../model/vt_users');

router.post('/send-otp', upload.none(), (req, res) => {

  let body = req.body;
  // Account details
  let apiKey = '5bfd187c06292be58f360208bb3cf6c0b504a703ca85179b73b092fe88ab3ee9';
  let username = "darpad2020@gmail.com";
  // Message details
  let numbers = [body.mobile];
  let sender = 'TXTLCL';
  // let otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  let otp = 1234;
  let message = `Use ${otp} as your OTP to verify ${body.autoOtpHash}`;

  vt_users.findOne({
    where: {
      mobile: body.mobile
    }
  })
    .then((data) => {
      if (data !== null) {
        data.update({
          otp: otp
        })
          .then(() => {
            numbers = numbers.join(',');

            // Prepare data for POST request
            let data = `username=${username}&hash=${apiKey}&numbers=${numbers}&sender=${sender}&message=${message}`;

            axios({
              url: 'https://api.textlocal.in/send/?' + data,
              method: 'POST',
            })
              .then((response) => {
                if (response.data.status === 'success') {
                  res.send({ status: 200, message: 'OTP sent to registered mobile number' });
                }
                else {
                  res.send({ status: 401, message: 'Error sending OTP!' });
                }
              })
              .catch((err) => {
                res.send({ status: 401, message: 'Error sending OTP!' });
              })
          })
          .catch(() => {
            res.send({ status: 401, message: 'Error Updating OTP!' });
          })
      }
      else {
        res.send({ status: 401, message: 'Mobile number does not exist! Please Signup' });
      }
    })
    .catch((err) => {

    })
});

module.exports = router;