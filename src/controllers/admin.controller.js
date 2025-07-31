import {asyncHandler} from '../utils/asyncHandler.js'
import {Admin} from '../models/admin.model.js'
import {ApiError} from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken'

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerAdmin = asyncHandler(async (req, res) => {

    const {fullName,email,password} = req.body
    if (!fullName || !email || !password) {
        throw new ApiError(400, "all fields are required")
    }
    // Check if the admin already exists
    const existingAdmin = await Admin.find({email})
    if (existingAdmin.length > 0) {
        throw new ApiError(400, "Admin already exists")
    }

    let profileImageLocalPath;
     if (req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length > 0) {
      profileImageLocalPath = req.files.profilePicture[0].path
     }

     const profilePicture = await uploadonCloudinary(profileImageLocalPath)
     if (!profilePicture) {
         throw new ApiError(500, "Failed to upload profile picture")
     }

     const admin = await Admin.create({
         fullName,
         email,
         password,
         profilePicture: profilePicture.secure_url
     })
    
     const createdAdmin = await Admin.findById(admin._id).select(
             "-password -refreshToken"
          )
     
          if (!createdAdmin) {
             throw new ApiError(500, "something went wrong while registering the admin")
          }
         
     
          return res.status(201).json(
             new ApiResponse(200, createdUser, "Admin registered successfully")
          )
})

const LoginAdmin = asyncHandler(async(req, res) =>{
 const {email,fullName, password} = req.body

 if (!fullName && !email) {
    throw new ApiError(400, "fullname or email is required")
 }
 
 // find the admin
 const admin = await Admin.findOne({
  $or: [{ fullName }, { email }]
 })
 
 if (!admin) {
    throw new ApiError(404, "admin does not exist")
 }

 const isPasswordValid = await admin.isPasswordCorrect(password)
 
 if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
 }
 
 const {accessToken, refreshToken}= await generateAccessAndRefereshTokens(user._id)
 
 const loggedInAdmin = await Admin.findById(admin._id).select(" -password -refreshToken")
 
 //send cookies
 
 const options = {
    httpOnly: true,
    secure: true
 }
 
 return res
 .status(200)
 .cookie("accessToken", accessToken, options)
 .cookie("refreshToken", refreshToken,options)
 .json(
    new ApiResponse(
       200,
       {
          admin: loggedInAdmin, accessToken, refreshToken
       },
       "Admin Logged In Successfully "
    )
 )

})

const logOutAdmin = asyncHandler(async(req, res) => {
await Admin.findByIdAndUpdate(
   req.admin._id,
   {
      $unset: {
         refreshToken: 1 // this will remove the field from the user document
      }
   },
   {
      new: true
   }
)

    const options = {
   httpOnly: true,
   secure: true
}

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "Admin Logged out"))
})

const refreshAccessToken = asyncHandler(async(req,res) =>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request")
   }

   try {
      const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.ACCESS_TOKEN_SECRET
      )
   
      const admin = await Admin.findById(decodedToken?._id)
   
      if (!admin) {
         throw new ApiError(401, "invalid refresh token")
      }
   
      if (incomingRefreshToken !== admin?.refreshToken) {
         throw new ApiError(401, "refresh token is expired or used")
      }
      
      const options = {
         httpOnly: true,
         secure: true
      }
   
      const {accessToken, newRefreshToken}= await generateAccessAndRefereshTokens(user._id)
    
      return res
      .status(200)
      .cookie("accessToken", accessToken,options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
         new ApiResponse(
            200,
            {accessToken, refreshToken: newRefreshToken},
            "Access Token Refreshed"
         )
      )    
   } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token")
   }

})

const updateAccountDetails = asyncHandler(async (req, res) => {
   const {fullName, email} = req.body

   if (!fullName || !email) {
      throw new ApiError(400, "all fields are required")
   }

   const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      {
         $set: {
            fullName,
            email
         }
      },
      { new: true}
   ).select("-password")

   return res
   .status(200)
   .json(new ApiResponse(200, user, "account details updated successfully"))

})

const updateAdminProfilePic = asyncHandler(async (req, res) =>{
   const profileImageLocalPath = req.file?.path

   if (!profileImageLocalPath) {
      throw new ApiError(400, "Profile image file is missing")
   }

   const profilePic = await uploadonCloudinary(profileImageLocalPath)

   if (!profilePic.url) {
      throw new ApiError(400, "error while uploading profile image")
   }

   const admin = Admin.findByIdAndUpdate(
      req.admin?._id,
      {
         $set: {
            profilePic: profilePic.url
         }
      },
      { new: true}
   ).select("-password")

   return res
   .status(200)
   .json(new ApiResponse(200, admin, "Profile image updated successfully"))

})

const updatePassword = asyncHandler(async(req, res) => {
   const {oldPassword, newPassword} = req.body
   const admin = await Admin.findById(req.admin?._id)
   const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword)

   if (!isPasswordCorrect) {
      throw new ApiError("400", "invalid old passsword")
   }

   admin.password = newPassword
   await admin.save({ validateBeforeSave: false})

   return res
   .status(200)
   .json(new ApiResponse(200, {}, "password changed successfully"))
})

const deleteAdmin = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        throw new ApiError(400, "Password is required for account deletion.");
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
        throw new ApiError(404, "Admin not found.");
    }

    // Verify password (assuming bcrypt)
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid password.");
    }

    await Admin.findByIdAndDelete(admin._id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Admin deleted successfully"));
});


export {
    registerAdmin,
    LoginAdmin,
    logOutAdmin,
    generateAccessAndRefereshTokens,
    refreshAccessToken,
    updateAccountDetails,
    updateAdminProfilePic,
    updatePassword,
    deleteAdmin
}
