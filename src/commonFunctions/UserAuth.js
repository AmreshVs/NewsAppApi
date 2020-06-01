let vt_users = require('../model/vt_users');

const UserAuth = (req, res, fn) => {
  let token = req.headers.authorization;

  if(token === undefined){
    res.status(401).send({status: 200, message: 'Token cannot be empty'});
    return fn(false);
  }

  vt_users.findOne({
    attributes: ['id'],
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
  .catch(() => {

  })
}

module.exports = UserAuth;