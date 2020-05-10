require('dotenv').config();
let express = require('express');
let app = express();
let bodyParser = require("body-parser");
let cors = require('cors');

let signup = require('./src/routes/signup');
let login = require('./src/routes/login');
let imageUpload = require('./src/routes/admin/post/imageUpload');

let alogin = require('./src/routes/admin/alogin');
let asignup = require('./src/routes/admin/asignup');
let newPost = require('./src/routes/admin/post/newPost');
let getPost = require('./src/routes/admin/post/getPost');
let deletePost = require('./src/routes/admin/post/deletePost');
let getAllPost = require('./src/routes/admin/post/getAllPost');
let getCategory = require('./src/routes/admin/categories/getCategorie');
let deleteCategory = require('./src/routes/admin/categories/deleteCategory');
let addCategory = require('./src/routes/admin/categories/addCategory');
let getAllCategory = require('./src/routes/admin/categories/getAllCategory');
let addBrand = require('./src/routes/admin/brands/addBrand');
let getBrand = require('./src/routes/admin/brands/getBrand');
let getAllBrand = require('./src/routes/admin/brands/getAllBrand');
let deleteBrand = require('./src/routes/admin/brands/deleteBrand');

// To solve CORS error
app.use(cors());

// To make public folder accessible by all users
app.use(express.static('public'));

// To parse the Request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// App User Routes
app.use([signup, login]);

// Admin Routes
app.use([
  alogin, asignup, imageUpload, getCategory, 
  newPost, getPost, getAllPost, deletePost, addCategory,
  deleteCategory, getAllCategory, addBrand, getBrand,
  getAllBrand, deleteBrand
]);

console.log("Running on port " + process.env.PORT);
app.listen(process.env.PORT);