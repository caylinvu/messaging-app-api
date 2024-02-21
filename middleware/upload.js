const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    console.log(file);
    console.log(`img-${new Date().toISOString()}-${file.originalname}`);
    cb(null, `img-${new Date().toISOString()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
