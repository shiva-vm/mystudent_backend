const { Router } = require('express');
const multer = require('multer')
const router = Router();
const { addStudent, getStudentById, updateStudent, login } = require('../component/student')
const path = require("path");

///IMAGE STORAGE DIRECTORY AND FILE NAME///
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000
    }
})

///STUDENT ROUTE///
router.post('/addStudent', upload.single('profile'), addStudent);
router.post('/updateStudentbyId/:id', upload.single('profile'), updateStudent);
router.get('/getStudentById/:id', getStudentById)
router.post('/login',login)
module.exports = router;