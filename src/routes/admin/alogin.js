let express = require('express');
let jwt = require('jsonwebtoken');
let multer = require('multer');
let bcrypt = require('bcryptjs');

let config = require('../../config/config');
let vt_int_users = require('../../model/vt_int_users');

let upload = multer();
let router = express.Router();

router.post('/alogin', upload.none(), (req, res) => {
  // Generate Token for authentication
  let token = jwt.sign({ id: req.body.username }, config.secret);

  vt_int_users.findOne({
    where: {
      username: req.body.username,
      is_verified: 1
    }
  })
    .then((data) => {
      // Compare the hashed password with stored password
      if (data !== null && bcrypt.compareSync(req.body.pass, data.pass)) {
        data.update({
          token: token,
        })
        .then((data) => {
          res.send({
            status: 200,
            message: 'Login Success',
            data: {
              user_id: data.id,
              username: data.username,
              email: data.email,
              user_type: data.user_type,
              token: data.token
            }
          });
        })
      }

      if(data !== null && !bcrypt.compareSync(req.body.pass, data.pass)) {
        res.status(401).send({ status: 401, message: 'Invalid Password!' });
      }

      if(data === null){
        res.status(401).send({ status: 401, message: 'Not registered or awaiting approval!' });
      }
    })
    .catch((err) => {
      console.log(err);
    })
});

module.exports = router;