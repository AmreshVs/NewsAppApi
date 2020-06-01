let vt_users = require('../model/vt_users');

const getNotificationViewed = async (req) => {
  let token = req.headers.authorization;
  return await vt_users.findOne({
    attributes: ['notifications_viewed'],
    where:{
      token: token,
    }
  })
  .then((user) => {
    if(user !== null){
      return user.notifications_viewed;
    }
    else{
      return '';
    }
  })
  .catch(() => {
    return '';
  })
}

module.exports = getNotificationViewed;