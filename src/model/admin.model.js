import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

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
refreshToken:{
    type: String,
}
},
{timestamps: true})

adminSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()

}) // this logic encrypt password

adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default mongoose.model.Admin || mongoose.model('Admin', adminSchema);