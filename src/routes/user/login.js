let express = require('express');
let multer = require('multer');
let jwt = require('jsonwebtoken');

let config = require('../../config/config');
let vt_users = require('../../model/vt_users');
let SendOtp = require('../../commonFunctions/sendOtp');

let upload = multer();
let router = express.Router();

router.post('/login', upload.none(), (req, res) => {
  
  let body = req.body;
  // Generate token for Authentication
  let token = jwt.sign({ id: body.email }, config.secret);
  
  // let otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  let otp = 1234;

  vt_users.findOne({
    where: {
      mobile: body.mobile,
      is_verified: true
    }
  })
    .then((data) => {
      if (data) {
        // If no OTP present, Send OTP and Save it in DB
        if (!body.otp) {
          data.update({
            otp: otp
          })
          .then(() => {
            if(SendOtp(body.mobile, `Use ${otp} as your OTP to verify ${body.autoOtpHash}`)){
              res.send({ status: 200, message: 'OTP sent to registered mobile number' });
            }
          })
        }
        else{
          vt_users.findOne({
            where:{
              mobile: body.mobile,
              otp: body.otp,
            }
          })
          // OTP Present and Authenticated, then update Token
          .then((data) => {
            if(data){
              data.update({
                token: token,
                notification_id: body.notification_id
              })
              .then((data) => {
                res.send({
                  status: 200,
                  message: 'Login Success',
                  data:{
                    user_id: data.id,
                    fullname: data.fullname,
                    citystate: data.citystate,
                    mobile: data.mobile,
                    token: data.token,
                    notification_id: data.notification_id
                  }
                });
              })
            }
            else{
              res.send({ status : 401, message: 'Invalid OTP' });
            }
          })
        }
      }
      else {
        res.send({ status : 401, message: 'Not registered! or Not verified Please signup' });
      }
    })
    .catch((err) => {
      console.log(err);
    })
});

module.exports = router;