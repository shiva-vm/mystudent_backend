
const StudentModel = require("../model/StudentModel")

const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfs7';
const iv = crypto.randomBytes(16);

///Password encryption function ///
const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

///Password decryption function ///
const decrypt = (hash) => {


    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};
///add new student in database///
module.exports.addStudent = async (req, res) => {
    try {
        const { name, email, password, address, degree, skills, experience, phone } = req.body

        await StudentModel.findOne({ 'email': email }, async function (err, student) {

            if (err) {
                console.log("err : ", err)
                return res.status(500).json({
                    resultCode: -1,
                    resultMessage: err
                });
            }

            //if student already present//
            if (student) {
                return res.status(200).json({
                    resultCode: -1,
                    resultMessage: "student already present with given emailId"
                });
            }

            //create new student//
            else {


               console.log(skills)
                const addStudent = await StudentModel.create({
                    name: name,
                    email: email,
                    password: JSON.stringify(encrypt(password)),
                    imageUrl: `http://localhost:8001/profile/${req.file.filename}`,
                    address: address,
                    degree: degree,
                    skills: skills,
                    experience: experience,
                    phone: phone
                });
                console.log("Student Added with id" + addStudent._id)
                return res.status(201).json({
                    resultCode: 1,
                    resultMessage: "success",
                    resultData: addStudent._id
                });
            }
        });
    }
    catch (err) {
        console.log("500 error")
        return res.status(500).json({
            error: error
        });
    }


}

///get student by Id ///
module.exports.getStudentById = async (req, res) => {
    try {
        console.log("in it")
        const studentId = req.params.id
        await StudentModel.findOne({ _id: studentId }, function (err, student) {

            if (err) {
                return res.status(500).json({
                    resultCode: -1,
                    resultMessage: err
                });
            }

            if (student) {

                student['password'] = ""
                console.log(student);
                return res.status(200).json({
                    resultCode: 1,
                    resultMessage: "success",
                    resultData: student
                });
            }
            else {
                return res.status(200).json({
                    resultCode: -1,
                    resultMessage: "Student not found with givenId",
                })
            }
        });
    }
    catch (error) {

        console.log("500 error")
        return res.status(500).json({
            error: error
        });
    }
}

///update student ///
module.exports.updateStudent = async (req, res) => {
    try {
        const { name, email, address, degree, skills, experience, phone } = req.body
        const studentId = req.params.id
        
        const filter = { _id: studentId };

        const update = {
            name: name,
            email: email,
            address: address,
            degree: degree,
            skills: skills,
            experience: experience,
            phone: phone
        };
        try{
            update['imageUrl']=`http://localhost:8001/profile/${req.file.filename}`
        }
        catch(error){
            console.log(error)
        }
        
         await StudentModel.findOneAndUpdate(filter, update, {
            new: true
        });
        return res.status(200).json({
            resultCode: 1,
            resultMessage: "updated"
        });

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "something went wrong"
        });
    }

}

///LOGIN OF STUDENT///
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email)
        await StudentModel.findOne({ email: email }, function (err, student) {
            if (err) throw err;

            if (student) {
               console.log(decrypt(JSON.parse(student.password)))
                if (decrypt(JSON.parse(student.password)) == password) {
                    return res.status(200).json({
                        resultCode: 1,
                        resultMessage: "Login successful",
                        resultData:student._id
                    });
                }
                else {
                    return res.status(200).json({
                        resultCode: -1,
                        resultMessage: "Login failed"
                        
                    });
                }

            }
            else {
                return res.status(200).json({
                    resultCode: -1,
                    resultMessage: "Student not found with givenId",
                })
            }
        });
    }
    catch (error) {
        console.log("500 error")
        return res.status(500).json({
            error: error
        });
    }



}