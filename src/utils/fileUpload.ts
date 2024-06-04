import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  },
});

export const upload = multer({ storage: storage });

// file upload with aws(amazone web service)

// const AWS = require('aws-sdk');

// // Configure AWS with your access and secret key.
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Add your access key here
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  // Add your secret key here
//     region: process.env.AWS_REGION  // Add your region here
// });

// module.exports = s3;

// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const s3 = require('./s3');

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.AWS_BUCKET_NAME,  // Add your bucket name here
//         acl: 'public-read',  // Access control for the files
//         metadata: (req, file, cb) => {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: (req, file, cb) => {
//             cb(null, Date.now().toString() + '-' + file.originalname);  // Unique file name
//         }
//     })
// });

// module.exports = upload;
