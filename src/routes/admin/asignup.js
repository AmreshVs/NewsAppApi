let express = require('express');
let multer = require('multer');

let vt_int_users = require('../../model/vt_int_users');
let bcrypt = require('bcryptjs');
let router = express.Router();
let upload = multer();

router.post('/asignup', upload.none(), (req, res) => {

  let body = req.body;
  let DbData = {
    username: body.username,
    email: body.email,
    pass: bcrypt.hashSync(body.pass),
    is_verified: 0,
  }

  if(validate(req.body, res)){
    vt_int_users.findOne({
      where:{
        username: DbData.username
      }
    })
    .then((data) => {
      if(data === null){
        // Create user and set the user verified
        vt_int_users.create(DbData).then(() => {
          res.send({status: 200, message: 'Signup Success, Awaiting Approval from Admin!'});
        })
      }
      else{
        res.send({status: 401, message: 'User already exist!'});
      }      
    })
    .catch((err) => {
      console.log(err);
    })
  };
});

const validate = (data, res) => {

  // Validations
  if(!data.username){
    res.send({status: 401, message: 'Username cannot be empty!'});
    return false;
  }

  if(!data.email){
    res.send({status: 401, message: 'Email cannot be empty!'});
    return false;
  }

  if(!data.pass){
    res.send({status: 401, message: 'Password cannot be empty!'});
    return false;
  }

  // Email Validation
  let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(!data.email.match(mailformat))
  {
    res.send({status: 401, message: 'Invalid Email format!'});
    return false;
  }

  return true;
}

module.exports = router;