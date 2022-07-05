 const {
   multer
 } = require('./index')
 storage = multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, './public/images')
     },
     filename: function (req, file, cb) {
       cb(null, new Date().toISOString() + '-' + file.originalname)
     }
   }),
   fileFilter = (req, file, cb) => {
     if (file.mimetype === 'text/csv' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
       cb(null, true);
     } else {
       cb(null, false);
     }
   }
 const upload = multer({
   storage: storage,
   fileFilter: fileFilter
 })

 module.exports = upload