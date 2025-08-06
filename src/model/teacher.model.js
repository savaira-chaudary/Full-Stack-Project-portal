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
 refreshToken: {
        type: String,
        // Stores the latest refresh token for the teacher(used for session management)
    },
    sessions: [
        {
            token: { 
                type: String, 
                required: true 
                // This is a refresh token used to manage multiple active sessions for the teacher
            },
            createdAt: { type: Date, default: Date.now },
            expiresAt: { type: Date }
        }
    ]

},{timestamps: true})

const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

export default Teacher;