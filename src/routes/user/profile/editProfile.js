let express = require('express');
let multer = require('multer');
let upload = multer();
let router = express.Router();

let UserAuth = require('../../../commonFunctions/UserAuth');
let vt_users = require('../../../model/vt_users');

router.post('/edit-profile', upload.none(), async (req, res) => {

  let body = req.body;

  // Authenticate User with token and then proceed
  UserAuth(req, res, (status) => {
    if(status){
      vt_users.findOne({
        where:{
          token: req.headers.authorization
        }
      })
      .then((user) => {
        if(user !== null){
          user.update({
            citystate: body.cityState
          })
          .then((update) => {
            res.status(200).send({ status: 200, message: 'Profile Updated!', data: update });
          })
          .catch(() => {
            res.status(401).send({ status: 401, message: 'Profile Updating Failed!' });
          })
        }
      })
    }
  })
});

module.exports = router;