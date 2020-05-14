let express = require('express');
let multer = require('multer');

let AdminAuth = require('../../../commonFunctions/AdminAuth');

// Specifying the storage path
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/video');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

let upload = multer({ storage: storage });
let router = express.Router();

// Get uploaded file from Form name - Upload
router.post('/video-upload', upload.single('upload'), async (req, res) => {
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, (status) => {
    if(status){
      const file = req.file;
      if (!file) {
        res.status(401).send({ status: 401, message: 'Please add file!' });
      }
      else{
        res.send({url: '/uploads/video/' + file.originalname});
      }
    }
  });
  
  
});

module.exports = router;