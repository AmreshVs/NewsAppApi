let vt_int_users = require('../model/vt_int_users');
status = null;

const AdminAuth = (req, res, fn) => {
  let token = req.headers.authorization;

  if(token === undefined){
    res.status(401).send({status: 'error', message: 'Token cannot be empty'});
    return fn(false);
  }

  vt_int_users.findOne({
    where:{
      token: token
    }
  })
  .then((data) => {
    if(data === null){
      res.status(401).send({status: 'error', message: 'Please Login to Continue'});
      return fn(false);
    }
    else{
      return fn(true);
    }
  })
  .catch(() => {

  })
}

module.exports = AdminAuth;