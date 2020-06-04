let express = require('express');
let multer = require('multer');
let jwt = require('jsonwebtoken');

let config = require('../../config/config');
let vt_users = require('../../model/vt_users');
let SendOtp = require('../../commonFunctions/sendOtp');
let router = express.Router();
let upload = multer();

router.post('/signup', upload.none(), (req, res) => {

  let body = req.body;
  // Generate Token for Authentication
  let token = jwt.sign({id: body.mobile}, config.secret);
  
  let otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  // let otp = 1234;

  let DbData = {
    fullname: body.fullname,
    citystate: body.citystate,
    mobile: body.mobile,
    is_verified: false,
    otp: otp,
    token: token,
    notification_token: body.notification_token
  }

  if(validate(req.body, res)){

    vt_users.findOne({
      where:{
        mobile: DbData.mobile
      }
    })
    .then((data) => {
      if(data === null){
        // If mobile number not present, Create user and set the user verified
        if(!body.otp){
          vt_users.create(DbData).then(async () => {
            let response = await SendOtp(body.mobile, `Use ${otp} as your OTP to verify ${body.autoOtpHash}`);
            if(response === false){
              res.send({ status: 401, message: 'Error Sending OTP' });
            }
            res.send({status: 200, message: 'OTP sent to registered mobile number'});
          })
        }
      }
      else if(data != null && !body.otp){
        res.send({status: 401, message: 'You are already Valar Tamil user, Please Signin'});
      }
      else{
        vt_users.findOne({
          where:{
            mobile: body.mobile,
            otp: body.otp
          }
        })
        .then((data) => {
          data.update({
            is_verified: true,
            notification_token: body.notification_token
          })
          .then((data) => {
            res.send({
              status: 200,
              message: 'Signup Success',
              data:{
                user_id: data.id,
                fullname: data.fullname,
                citystate: data.citystate,
                mobile: data.mobile,
                token: data.token,
                notification_token: data.notification_token
              }
            });
          })
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })
  };
});

const validate = (data, res) => {

  // Validations
  if(!data.fullname){
    res.send({status: 401, message: 'Fullname cannot be empty!'});
    return false;
  }

  else if(!data.mobile){
    res.send({status: 401, message: 'Mobile Number cannot be empty!'});
    return false;
  }

  else if(!data.citystate){
    res.send({status: 401, message: 'City & State cannot be empty!'});
    return false;
  }

  // Phone Number validation
  let regx = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/;
  if(!regx.test(data.mobile)){
    res.send({status: 401, message: 'Invalid mobile number!'});
    return false;
  }
  return true;
}

module.exports = router;