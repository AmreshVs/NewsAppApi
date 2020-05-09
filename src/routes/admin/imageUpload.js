let express = require('express');
let multer = require('multer');

let config = require('../../config/config'); 
let AdminAuth = require('../../commonFunctions/AdminAuth');

// Specifying the storage path
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

let upload = multer({ storage: storage });
let router = express.Router();

// Get uploaded file from Form name - Upload
router.post('/image-upload', upload.single('upload'), async (req, res) => {
  // Authenticate Admin with token and then proceed
  AdminAuth(req, res, () => {
    const file = req.file;
    if (!file) {
      res.status(401).send({ status: 401, message: 'Please add file!' });
    }
    else{
      res.send({url: config.APP_URL + '/uploads/images/' + file.originalname});
    }
  });
  
  
});

module.exports = router;