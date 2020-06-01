let vt_users = require('../model/vt_users');

const getUserId = async (req) => {
  let token = req.headers.authorization;
  return vt_users.findOne({
    attributes: ['id'],
    where:{
      token: token,
      is_verified: 1
    }
  })
  .then((data) => {
    if(data !== null){
      return data.id;
    }
  })
}

module.exports = getUserId;