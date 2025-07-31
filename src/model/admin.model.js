import mongoose, {Schema} from 'mongoose';

const adminSchema = new Schema({
fullName: {
         type: String, 
         required: true, 
    },
email:    { 
    type: String, 
    required: true, 
    unique: true 
    },
password: {
     type: String,
     required: true 
    },
role: { 
    type: String, 
    default: 'admin' 
    },
profilePicture: { 
    type: String 
    },
},
{timestamps: true})

export default mongoose.model.Admin || mongoose.model('Admin', adminSchema);