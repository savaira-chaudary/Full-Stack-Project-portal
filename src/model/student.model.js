import mongoose,{Schema} from "mongoose";

const studentSchema = new Schema({
username: {
         type: String, 
         required: true, 
    },
email:    { 
    type: String, 
    required: true, 
    },
password: {
     type: String,
     required: true 
    },
rollno: {
    type: String,
    required: true,
    unique: true
    },
profilePicture: { 
    type: String
    },
phone: {
    type: Number,
    required: true,
},
address: {
    type: String,
    required: true,
},
},
{timestamps: true})

export default mongoose.model.Student || mongoose.model('Student', studentSchema);