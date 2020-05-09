let express = require('express');
let app = express();
let bodyParser = require("body-parser");
let cors = require('cors');

let signup = require('./src/routes/signup');
let login = require('./src/routes/login');
let imageUpload = require('./src/routes/admin/imageUpload');

let alogin = require('./src/routes/admin/alogin');
let getCategories = require('./src/routes/admin/getCategories');
let getBrands = require('./src/routes/admin/getBrands');
let newPost = require('./src/routes/admin/newPost');
let getPost = require('./src/routes/admin/getPost');
let deletePost = require('./src/routes/admin/deletePost');
let getAllPost = require('./src/routes/admin/getAllPost');
let addCategory = require('./src/routes/admin/addCategory');

app.use(cors());
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use([signup, login]);

app.use([
  alogin, imageUpload, getCategories, getBrands, 
  newPost, getPost, getAllPost, deletePost,
  addCategory
]);

app.listen(process.env.PORT || 6000);