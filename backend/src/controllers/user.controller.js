import { User } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

// Helper: Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validate: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// ==================== REGISTER ====================
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  const existedUser = await User.findOne({
    where: {
      [Op.or]: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    },
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  let avatarUrl = "";
  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(400, "Avatar file upload failed");
    }
    avatarUrl = avatar.url;
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: avatarUrl,
    username: username.toLowerCase(),
    role: "USER",
  });

  const createdUser = await User.findByPk(user.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// ==================== LOGIN ====================
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  const whereCondition = {};
  if (email) whereCondition.email = email.toLowerCase();
  if (username) whereCondition.username = username.toLowerCase();

  const user = await User.findOne({
    where: Object.keys(whereCondition).length > 1
      ? { [Op.or]: [{ email: whereCondition.email }, { username: whereCondition.username }] }
      : whereCondition,
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.id
  );

  const loggedInUser = await User.findByPk(user.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// ==================== LOGOUT ====================
const logoutUser = asyncHandler(async (req, res) => {
  await User.update(
    { refreshToken: null },
    { where: { id: req.user.id } }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// ==================== REFRESH ACCESS TOKEN ====================
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findByPk(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user.id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// ==================== CHANGE PASSWORD ====================
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user?.id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword; // beforeSave hook will hash it
  await user.save({ validate: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ==================== UPDATE USER PROFILE ====================
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName && !email) {
    throw new ApiError(400, "At least one field is required");
  }

  const updateData = {};
  if (fullName) updateData.fullName = fullName;
  if (email) updateData.email = email;

  await User.update(updateData, {
    where: { id: req.user?.id },
  });

  const user = await User.findByPk(req.user?.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// ==================== GET CURRENT USER ====================
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

// get total users count //
const getTotalUsersCount = asyncHandler(async (req, res) => {
  const totalUsers = await User.count();

  return res
    .status(200)
    .json(new ApiResponse(200, { total: totalUsers }, "Total users count fetched"));
});

// ==================== ADMIN: GET ALL USERS ====================
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password", "refreshToken"] },
    order: [["createdAt", "DESC"]],
  });

  if (!users || users.length === 0) {
    throw new ApiError(404, "No users found in database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully"));
});

// ==================== ADMIN: DELETE USER ====================
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (req.user.id.toString() === id) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const deleted = await User.destroy({ where: { id } });

  if (!deleted) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

// ==================== ADMIN: UPDATE USER ROLE ====================
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = req.body.role?.toUpperCase();

  const validRoles = ["USER", "REPORTER", "EDITOR", "ADMIN"];
  if (!validRoles.includes(role)) {
    throw new ApiError(400, "Invalid role specified");
  }

  // Prevent admin from changing their own role to something else
  if (req.user.id.toString() === id && role !== "ADMIN") {
    throw new ApiError(400, "You cannot demote yourself from Admin");
  }

  const [updatedCount] = await User.update(
    { role },
    { where: { id } }
  );

  if (!updatedCount) {
    throw new ApiError(404, "User not found");
  }

  const user = await User.findByPk(id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  getTotalUsersCount,
  getAllUsers,
  deleteUser,
  updateUserRole,
};
