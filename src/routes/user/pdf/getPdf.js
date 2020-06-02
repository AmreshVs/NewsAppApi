let express = require('express');
let multer = require('multer');

let vt_pdfs = require('../../../model/vt_pdfs');
let vt_favourites = require('../../../model/vt_favourites');
let UserAuth = require('../../../commonFunctions/UserAuth');
let getUserId = require('../../../commonFunctions/getUserId');

let upload = multer();
let router = express.Router();

router.get('/get-user-pdf', upload.none(), async (req, res) => {
  
  let pdf_id = req.query.id;
  let user_id = await getUserId(req);
  
  // Authenticate User with token and then proceed
  UserAuth(req, res, (status) => {
    if(status){
      vt_pdfs.findOne({
        where:{
          id: pdf_id
        },
      })
        .then(async (data) => {
          
          let {id, url } = data;
          
          let result = {
            id: id,
            url: url,
            is_favourite: await getIsfavourite(user_id, id)
          }

          if(data !== null) {
            res.status(200).send({ status: 200, message: '', data: result });
          }
          if(data === null){
            res.status(401).send({ status: 401, message: 'No Pdf found!' });
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  })
});

async function getIsfavourite(user_id, id){
  return vt_favourites.findOne({
    where:{
      user_id: user_id
    }
  })
  .then((favourite) => {
    let news_fav = (favourite.pdfs).split(',');
    if(news_fav.includes(`${id}`)){
      return true;
    }
    return false;
  })
}

module.exports = router;