let vt_users = require('../model/vt_users');
let vt_int_users = require('../model/vt_int_users');

const UserOrAdminAuth = (req, res, fn) => {
  let token = req.headers.authorization;

  if(token === undefined){
    res.status(401).send({status: 200, message: 'Token cannot be empty'});
    return fn(false);
  }

  vt_users.findOne({
    where:{
      token: token,
      is_verified: 1
    }
  })
  .then((data) => {
    if(data === null){
      vt_int_users.findOne({
        where:{
          token: token,
          is_verified: 1
        }
      })
      .then((data) => {
        if(data === null){
          res.status(401).send({status: 401, message: 'Please Login to Continue'});
          return fn(false);
        }
        else{
          return fn(true);
        }
      })
    }
    else{
      return fn(true);
    }
  })
  .catch(() => {
    res.status(401).send({status: 401, message: 'Unable to Authenticate'});
    return fn(false);
  })
}

module.exports = UserOrAdminAuth;