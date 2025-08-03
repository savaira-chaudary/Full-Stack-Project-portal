import mongoose,{Schema} from "mongoose";

const teacherSchema = new Schema({
  fullName: {
     type: String, 
     required: true 
    },
  email:    { 
    type: String, 
    required: true,
},
  password: { 
    type: String, 
    required: true 
},
  teacherId: {
    type: String, 
    required: true, 
    unique: true
},
  phone:    { 
    type: String 
},
  gender:   { type: String, 
    enum: ['Male', 'Female'] 
},
  address:  { 
    type: String 
},
  subjectSpecialization: { 
    type: String 
},
  qualification: { 
    type: String 
},
  profilePicture: { 
    type: String 
},

},{timestamps: true})

const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

export default Teacher;