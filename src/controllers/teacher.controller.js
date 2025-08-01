import { asyncHandler } from "../utils/asyncHandler"
import { Teacher} from "../models/teacher.model"
import { ApiError } from "../utils/apiError"
import { ApiResponse } from "../utils/apiResponse"
import { uploadonCloudinary } from "../utils/cloudinary"
import jwt from "jsonwebtoken"
import { generateAccessAndRefereshTokens } from "./admin.controller"

const registerTeacher = asyncHandler(async (req, res) => {

    const {fullName,email,password} = req.body
    if (!fullName || !email || !password) {
        throw new ApiError(400, "all fields are required")
    }
    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
if (existingTeacher) {
    throw new ApiError(400, "Teacher already exists");
}

    let profileImageLocalPath;
     if (req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length > 0) {
      profileImageLocalPath = req.files.profilePicture[0].path
     }

     const profilePicture = await uploadonCloudinary(profileImageLocalPath)
     if (!profilePicture) {
         throw new ApiError(500, "Failed to upload profile picture")
     }

     const teacher = await Teacher.create({
         fullName,
         email,
         password,
         profilePicture: profilePicture.secure_url,
         phone: req.body.phone || "",
         address: req.body.address || "",
         subjectSpecialization: req.body.subjectSpecialization || "",
         qualification: req.body.qualification

     })

     if (!teacher) {
        throw new ApiError(500, "something went wrong while registering the teacher")
     }
    
     const createdTeacher = await Teacher.findById(teacher._id).select("-password -refreshToken");
     
          if (!createdTeacher) {
             throw new ApiError(500, "something went wrong while registering the teacher")
          }
         
     
          return res.status(201).json(
             new ApiResponse(200, createdTeacher, "teacher registered successfully")
          )
})

const LoginTeacher = asyncHandler(async(req, res) =>{
 const {email,fullName, password} = req.body

 if (!fullName && !email) {
    throw new ApiError(400, "fullname or email is required")
 }
 
 // find the Teacher
 const teacher = await Teacher.findOne({
  $or: [{ fullName }, { email }]
 })
 
 if (!teacher) {
    throw new ApiError(404, "teacher does not exist")
 }

 const isPasswordValid = await teacher.isPasswordCorrect(password)
 
 if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
 }
 
 const {accessToken, refreshToken}= await generateAccessAndRefereshTokens(teacher._id)
 
 const loggedInTeacher = await Teacher.findById(teacher._id).select(" -password -refreshToken")
 
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
          teacher: loggedInTeacher, accessToken, refreshToken
       },
       "Teacher Logged In Successfully "
    )
 )

})

const logOutTeacher = asyncHandler(async(req, res) => {
await Teacher.findByIdAndUpdate(
   req.teacher._id,
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
   .json(new ApiResponse(200, {}, "teacher Logged out"))
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
   
      const teacher = await Teacher.findById(decodedToken?._id)
   
      if (!teacher) {
         throw new ApiError(401, "invalid refresh token")
      }
   
      if (incomingRefreshToken !== teacher?.refreshToken) {
         throw new ApiError(401, "refresh token is expired or used")
      }
      
      const options = {
         httpOnly: true,
         secure: true
      }
   
      const {accessToken, newRefreshToken}= await generateAccessAndRefereshTokens(teacher._id)
    
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

const updateNameOrEmail = asyncHandler(async (req, res) => {
   const {fullName, email} = req.body

   if (!fullName || !email) {
      throw new ApiError(400, "all fields are required")
   }

   const teacher = await Teacher.findByIdAndUpdate(
      req.teacher._id,
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
   .json(new ApiResponse(200, teacher, "Name/Email updated successfully"))

})

const updateTeacherProfilePic = asyncHandler(async (req, res) =>{
   const profileImageLocalPath = req.file?.path

   if (!profileImageLocalPath) {
      throw new ApiError(400, "Profile image file is missing")
   }

   const profilePic = await uploadonCloudinary(profileImageLocalPath)

   if (!profilePic.url) {
      throw new ApiError(400, "error while uploading profile image")
   }

   const teacher = Teacher.findByIdAndUpdate(
      req.teacher?._id,
      {
         $set: {
            profilePic: profilePic.url
         }
      },
      { new: true}
   ).select("-password")

   return res
   .status(200)
   .json(new ApiResponse(200, teacher, "Profile image updated successfully"))

})

const updateTeacherPassword = asyncHandler(async(req, res) => {
   const {oldPassword, newPassword} = req.body
   const teacher = await Teacher.findById(req.teacher?._id)
   const isPasswordCorrect = await teacher.isPasswordCorrect(oldPassword)

   if (!isPasswordCorrect) {
      throw new ApiError("400", "invalid old passsword")
   }

   teacher.password = newPassword
   await teacher.save({ validateBeforeSave: false})

   return res
   .status(200)
   .json(new ApiResponse(200, {}, "password changed successfully"))
})

const updateTeacherPhoneNo = asyncHandler(async (req, res) => {
   const { phone } = req.body;
    if (!phone) {
        throw new ApiError(400, "Phone number is required");
    }
    const teacher = await Teacher.findByIdAndUpdate(
        req.teacher._id,
        {
            $set: {
                phone
            }
        },
        { new: true }
    ).select("-password");
    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, teacher, "Phone number updated successfully"));
})

const updateTeacherAddress = asyncHandler(async (req, res) => {
    const { address } = req.body;
    if (!address) {
         throw new ApiError(400, "Address is required");
    }
    const teacher = await Teacher.findByIdAndUpdate(
         req.teacher._id,
         {
              $set: {
                address
              }
         },
         { new: true }
    ).select("-password");
    if (!teacher) {
         throw new ApiError(404, "Teacher not found");
    }
    return res
         .status(200)
         .json(new ApiResponse(200, teacher, "Address updated successfully"));
})

const deleteTeacher = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        throw new ApiError(400, "Password is required for account deletion.");
    }

    const teacher = await Teacher.findById(req.teacher._id);
    if (!teacher) {
        throw new ApiError(404, "Teacher not found.");
    }

    // Verify password (assuming bcrypt)
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid password.");
    }

    await teacher.findByIdAndDelete(teacher._id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Teacher deleted successfully"));
});

export {
    registerTeacher,
    LoginTeacher,
    logOutTeacher,
    refreshAccessToken,
    updateNameOrEmail,
    updateTeacherProfilePic,
    updateTeacherPassword,
    updateTeacherPhoneNo,
    updateTeacherAddress,
    deleteTeacher
}