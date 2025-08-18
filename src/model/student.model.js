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
gender:   { 
    type: String, 
    enum: ['Male', 'Female'] 
},
 refreshToken: {
        type: String,
        // Stores the latest refresh token  (used for session management)
},
  sessions: [
        {
            token: { 
                type: String, 
                required: true 
                // This is a refresh token used to manage multiple active sessions for the student
            },
            createdAt: { type: Date, default: Date.now },
            expiresAt: { type: Date }
        }
    ]
},
{timestamps: true})

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;