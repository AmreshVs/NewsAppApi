let express = require('express');
let multer = require('multer');

let upload = multer();
let router = express.Router();

router.get('/', upload.none(), (req, res) => {
  res.send('Valar Tamil API Server is running');
});

module.exports = router;