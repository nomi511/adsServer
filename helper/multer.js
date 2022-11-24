const multer = require('multer')

// image upload
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './images')
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') +'-'+ file.originalname)
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }else{
        cb('invalid image', false)
    }
}
const uploads = multer({storage, fileFilter})

module.exports = uploads