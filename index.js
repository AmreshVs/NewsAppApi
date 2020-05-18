require('dotenv').config();
let express = require('express');
let app = express();
let bodyParser = require("body-parser");
let cors = require('cors');

let signup = require('./src/routes/signup');
let login = require('./src/routes/login');
let sendOtp = require('./src/routes/common/sendOtp'); // POST - send-otp

let alogin = require('./src/routes/admin/alogin'); // POST - /alogin
let asignup = require('./src/routes/admin/asignup'); // POST - /asignup

let newPost = require('./src/routes/admin/post/newPost'); // POST - /new-post
let getPost = require('./src/routes/admin/post/getPost'); // GET - /get-post
let getAllPost = require('./src/routes/admin/post/getAllPost'); // GET - /get-all-post
let deletePost = require('./src/routes/admin/post/deletePost'); // GET - /delete-post
let imageUpload = require('./src/routes/admin/post/imageUpload');

let categories = require('./src/routes/admin/categories/categories'); // GET - /categories
let addCategory = require('./src/routes/admin/categories/addCategory'); // POST - /add-category
let getCategory = require('./src/routes/admin/categories/getCategory'); // GET - /get-category
let getAllCategory = require('./src/routes/admin/categories/getAllCategory'); // GET - /get-all-category
let deleteCategory = require('./src/routes/admin/categories/deleteCategory'); // GET - /delete-category

let brands = require('./src/routes/admin/brands/brands'); // GET - /brands
let addBrand = require('./src/routes/admin/brands/addBrand'); // POST - /add-brand
let getBrand = require('./src/routes/admin/brands/getBrand'); // GET - /get-brand
let getAllBrand = require('./src/routes/admin/brands/getAllBrand'); // GET - /get-all-brand
let deleteBrand = require('./src/routes/admin/brands/deleteBrand'); // GET - /delete-brand

let addComment = require('./src/routes/comments/addComment'); // POST - /add-comment

let addPdf = require('./src/routes/admin/pdf/addPdf');
let getAllPdf = require('./src/routes/admin/pdf/getAllPdf');
let getPdf = require('./src/routes/admin/pdf/getPdf');
let deletePdf = require('./src/routes/admin/pdf/deletePdf');
let pdfUpload = require('./src/routes/admin/pdf/pdfUpload');

let addVideo = require('./src/routes/admin/video/addVideo');
let getAllVideo = require('./src/routes/admin/video/getAllVideo');
let getVideo = require('./src/routes/admin/video/getVideo');
let deleteVideo = require('./src/routes/admin/video/deleteVideo');
let videoUpload = require('./src/routes/admin/video/videoUpload');

// Dummy Data API
let dummyPosts = require('./src/dummyData/dummyPosts');
let dummyPdfs = require('./src/dummyData/dummyPdfs');
let dummyVideos = require('./src/dummyData/dummyVideos');

// To solve CORS error
app.use(cors());

// To make public folder accessible by all users
app.use(express.static('public'));

// To parse the Request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// App User Routes
app.use([signup, login, addComment, sendOtp]);

// Admin Routes
app.use([
  alogin, asignup, imageUpload, getCategory, 
  newPost, getPost, getAllPost, deletePost, addCategory,
  deleteCategory, getAllCategory, addBrand, getBrand,
  getAllBrand, deleteBrand, categories, brands, pdfUpload,
  addPdf, getAllPdf, getPdf, deletePdf, videoUpload, addVideo,
  getAllVideo, getVideo, deleteVideo
]);

// Dummy Data Routes
app.use([dummyPosts, dummyPdfs, dummyVideos]);

console.log("Running on port " + process.env.PORT);
app.listen(process.env.PORT);