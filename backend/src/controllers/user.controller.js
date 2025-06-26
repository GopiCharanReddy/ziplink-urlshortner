import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import {registerUserSchema, loginUserSchema} from '../validators/user.validators.js'
import z from 'zod'
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async (userId) => {
  try{
    const user = await User.findById(userId).select("-password -refreshToken")
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    user.save({validateBeforeSave: false})
    return { accessToken, refreshToken}
  }catch(error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token.")
  }
}

const registerUser = asynchandler(async (req, res) => {
  try {
    const validatedRegisterData = registerUserSchema.parse(req.body)
    const { username, email, password, confirmPassword} = validatedRegisterData;
  
    if ([username, email, password, confirmPassword].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required.");
    }
  
    if(password !== confirmPassword) {
      throw new ApiError(400, "Password and confirmPassword do no match.")
    }
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
  
    if (existingUser) {
      throw new ApiError(403, "User with email or username already exists.");
    }
    const user = await User.create({
      username: username,
      email,
      password,
    });
  
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user.");
    }
  
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully."));
  } catch (error) {
    if(error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => err.message);
      throw new ApiError(400, "Validation failed: " + errorMessage.join(', '))
    }
    throw error
  }
});

const loginUser = asynchandler(async (req, res) => {
  const validatedLoginData = loginUserSchema.parse(req.body)
  const { email, password } = validatedLoginData

  if (!email || !password) {
    throw new ApiError(400, "Email or Password is required.");
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password.");
  }
  const userLoggedIn = user.toObject()
  delete userLoggedIn.password
  
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          userLoggedIn,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully."
      )
    )
});

const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1,
    }
  },{
    new: true,
  })

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out Successfully."))
})

const refreshAccessToken = asynchandler(async (req,res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request.")
  }

  try{
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if(!user) {
      throw new ApiError(401, "Invalid refresh Token")
    }
    if(incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used.")
    }

    const options = {
      httpOnly: true,
      secure: true,
    }

    const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)

    return res
    .status(200)
    .cookie("accessToken",  accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json( new ApiResponse(200, {accessToken, newRefreshToken}, "Access token refrehsed successfully."))
  }catch(error) {
    throw new ApiError(401, error?.message || "Invalid refresh token.")
  }
})

export {registerUser, loginUser, logoutUser, refreshAccessToken}