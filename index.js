require('dotenv').config();
let express = require('express');
let app = express();
let bodyParser = require("body-parser");
let cors = require('cors');

let signup = require('./src/routes/user/signup'); // POST - /signup
let login = require('./src/routes/user/login'); // POST - /login
let latestNews = require('./src/routes/user/home/latestNews'); // GET - /latest-news
let topSection = require('./src/routes/user/home/topSection'); // GET - /top-section  
let sendOtp = require('./src/routes/common/sendOtp'); // POST - /send-otp

let alogin = require('./src/routes/admin/alogin'); // POST - /alogin
let asignup = require('./src/routes/admin/asignup'); // POST - /asignup

let newPost = require('./src/routes/admin/news/newNews'); // POST - /new-news
let getPost = require('./src/routes/admin/news/getNews'); // GET - /get-news
let getAllPost = require('./src/routes/admin/news/getAllNews'); // GET - /get-all-news
let deletePost = require('./src/routes/admin/news/deleteNews'); // GET - /delete-news
let imageUpload = require('./src/routes/admin/news/imageUpload');

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

let addPdf = require('./src/routes/admin/pdf/addPdf'); // POST - /add-pdf
let getAllPdf = require('./src/routes/admin/pdf/getAllPdf'); // GET - /get-all-brand
let getPdf = require('./src/routes/admin/pdf/getPdf'); // GET - /get-brand
let deletePdf = require('./src/routes/admin/pdf/deletePdf'); // GET - /delete-pdf
let pdfUpload = require('./src/routes/admin/pdf/pdfUpload'); // POST - /pdf-upload

let addVideo = require('./src/routes/admin/video/addVideo'); // POST - /add-video
let getAllVideo = require('./src/routes/admin/video/getAllVideo'); // GET - /get-all-video
let getVideo = require('./src/routes/admin/video/getVideo'); // GET - /get-video
let deleteVideo = require('./src/routes/admin/video/deleteVideo'); // GET - /delete-video
let videoUpload = require('./src/routes/admin/video/videoUpload'); // POST - /video-upload

// Dummy Data API
let dummyPosts = require('./src/dummyData/dummyNews'); // POST - /dummy-news
let dummyPdfs = require('./src/dummyData/dummyPdfs'); // POST - /dummy-pdfs
let dummyVideos = require('./src/dummyData/dummyVideos'); // POST - /dummy-videos

// To solve CORS error
app.use(cors());

// To make public folder accessible by all users
app.use(express.static('public'));

// To parse the Request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// App User Routes
app.use([signup, login, addComment, sendOtp, latestNews, topSection]);

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