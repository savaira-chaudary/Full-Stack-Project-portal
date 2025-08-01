import { asyncHandler } from "../utils/asyncHandler"
import { Student } from "../models/Student.model"
import { ApiError } from "../utils/apiError"
import { ApiResponse } from "../utils/apiResponse"
import { uploadonCloudinary } from "../utils/cloudinary"
import jwt from "jsonwebtoken"
import { generateAccessAndRefereshTokens } from "./admin.controller"

const registerStudent = asyncHandler(async (req, res) => {

    const {fullName,email,password} = req.body
    if (!fullName || !email || !password) {
        throw new ApiError(400, "all fields are required")
    }
    // Check if the student already exists
    const existingStudent = await Student.findOne({ email });
if (existingStudent) {
    throw new ApiError(400, "Student already exists");
}

    let profileImageLocalPath;
     if (req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length > 0) {
      profileImageLocalPath = req.files.profilePicture[0].path
     }

     const profilePicture = await uploadonCloudinary(profileImageLocalPath)
     if (!profilePicture) {
         throw new ApiError(500, "Failed to upload profile picture")
     }

     const student = await Student.create({
         username,
         email,
         password,
         profilePicture: profilePicture.secure_url,
         phone: req.body.phone || "",
         address: req.body.address || "",
         gender: req.body.gender || ""

     })

     if (!student) {
        throw new ApiError(500, "something went wrong while registering the student")
     }
    
     const createdStudent = await Teacher.findById(student._id).select("-password -refreshToken");
     
          if (!createdStudent) {
             throw new ApiError(500, "something went wrong while registering the Student")
          }
         
     
          return res.status(201).json(
             new ApiResponse(200, createdStudent, "student registered successfully")
          )
})

const LoginStudent = asyncHandler(async(req, res) =>{
 const {email,fullName, password} = req.body

 if (!fullName && !email) {
    throw new ApiError(400, "fullname or email is required")
 }
 
 // find the Teacher
 const student = await Student.findOne({
  $or: [{ fullName }, { email }]
 })
 
 if (!student) {
    throw new ApiError(404, "student does not exist")
 }

 const isPasswordValid = await student.isPasswordCorrect(password)
 
 if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
 }
 
 const {accessToken, refreshToken}= await generateAccessAndRefereshTokens(student._id)
 
 const loggedInStudent = await Student.findById(student._id).select(" -password -refreshToken")
 
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
          student: loggedInStudent, accessToken, refreshToken
       },
       "Student Logged In Successfully "
    )
 )

})

const logOutStudent = asyncHandler(async(req, res) => {
await Student.findByIdAndUpdate(
   req.student._id,
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
   .json(new ApiResponse(200, {}, "student Logged out"))
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
   
      const student = await Student.findById(decodedToken?._id)
   
      if (!student) {
         throw new ApiError(401, "invalid refresh token")
      }
   
      if (incomingRefreshToken !== student?.refreshToken) {
         throw new ApiError(401, "refresh token is expired or used")
      }
      
      const options = {
         httpOnly: true,
         secure: true
      }
   
      const {accessToken, newRefreshToken}= await generateAccessAndRefereshTokens(student._id)
    
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

   const student = await Student.findByIdAndUpdate(
      req.student._id,
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
   .json(new ApiResponse(200, student, "Name/Email updated successfully"))

})

const updateStudentProfilePic = asyncHandler(async (req, res) =>{
   const profileImageLocalPath = req.file?.path

   if (!profileImageLocalPath) {
      throw new ApiError(400, "Profile image file is missing")
   }

   const profilePic = await uploadonCloudinary(profileImageLocalPath)

   if (!profilePic.url) {
      throw new ApiError(400, "error while uploading profile image")
   }

   const student = Student.findByIdAndUpdate(
      req.student?._id,
      {
         $set: {
            profilePic: profilePic.url
         }
      },
      { new: true}
   ).select("-password")

   return res
   .status(200)
   .json(new ApiResponse(200, student, "Profile image updated successfully"))

})

const updateStudentPassword = asyncHandler(async(req, res) => {
   const {oldPassword, newPassword} = req.body
   const student = await Student.findById(req.student?._id)
   const isPasswordCorrect = await student.isPasswordCorrect(oldPassword)

   if (!isPasswordCorrect) {
      throw new ApiError("400", "invalid old passsword")
   }

   student.password = newPassword
   await student.save({ validateBeforeSave: false})

   return res
   .status(200)
   .json(new ApiResponse(200, {}, "password changed successfully"))
})

const updateStudentPhoneNo = asyncHandler(async (req, res) => {
   const { phone } = req.body;
    if (!phone) {
        throw new ApiError(400, "Phone number is required");
    }
    const student = await Student.findByIdAndUpdate(
        req.student._id,
        {
            $set: {
                phone
            }
        },
        { new: true }
    ).select("-password");
    if (!student) {
        throw new ApiError(404, "student not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, student, "Phone number updated successfully"));
})

const updateStudentAddress = asyncHandler(async (req, res) => {
    const { address } = req.body;
    if (!address) {
         throw new ApiError(400, "Address is required");
    }
    const student = await Student.findByIdAndUpdate(
         req.student._id,
         {
              $set: {
                address
              }
         },
         { new: true }
    ).select("-password");
    if (!student) {
         throw new ApiError(404, "student not found");
    }
    return res
         .status(200)
         .json(new ApiResponse(200, student, "Address updated successfully"));
})

const deleteStudent = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        throw new ApiError(400, "Password is required for account deletion.");
    }

    const student = await Student.findById(req.student._id);
    if (!student) {
        throw new ApiError(404, "student not found.");
    }

    // Verify password (assuming bcrypt)
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid password.");
    }

    await student.findByIdAndDelete(student._id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "student deleted successfully"));
});
export {
    registerStudent,
    LoginStudent,
    logOutStudent,
    refreshAccessToken,
    updateNameOrEmail,
    updateStudentProfilePic,
    updateStudentPassword,
    updateStudentPhoneNo,
    updateStudentAddress,
    deleteStudent
}