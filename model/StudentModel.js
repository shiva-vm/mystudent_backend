const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const studentSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    imageUrl: { type: String, require: true },
    address: { type: String, require: true },
    degree: { type: String, require: true },
    skills: [{type:String,require:true}],
    experience: { type: String, require: true },
    phone: { type: Number, required: true },
    createdOn: { type: Date, required: false, default: new Date() }
})

const studentModel = mongoose.model('student', studentSchema)
module.exports = studentModel