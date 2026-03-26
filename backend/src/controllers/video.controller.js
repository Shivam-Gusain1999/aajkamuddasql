import { Video, Category } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Op } from "sequelize";

// Utility: Extract YouTube Video ID
const getYoutubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ==================== CREATE VIDEO ====================
const createVideo = asyncHandler(async (req, res) => {
  const { title, description, category, videoUrl, status } = req.body;

  if (!title || !videoUrl || !category) {
    throw new ApiError(400, "Title, video URL, and category are required");
  }

  let thumbnailUrl = null;
  const thumbnailLocalPath = req.file?.path;

  if (thumbnailLocalPath) {
    const uploaded = await uploadOnCloudinary(thumbnailLocalPath);
    if (!uploaded) throw new ApiError(400, "Thumbnail upload failed");
    thumbnailUrl = uploaded.url;
  } else {
    const ytId = getYoutubeVideoId(videoUrl);
    if (ytId) {
      thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }

  const video = await Video.create({
    title,
    description,
    videoUrl,
    categoryId: category,
    status: status || "DRAFT",
    thumbnail: thumbnailUrl,
  });

  const populatedVideo = await Video.findByPk(video.id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, populatedVideo, "Video created successfully"));
});

// ==================== GET VIDEOS (WITH CATEGORY FILTER) ====================
const getVideos = asyncHandler(async (req, res) => {
  const { status, limit = 8, page = 1, category } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const whereCondition = {};
  if (status) whereCondition.status = status;

  if (category) {
    const decodedCategory = decodeURIComponent(category).trim();
    const categoryDoc = await Category.findOne({
      where: { name: { [Op.like]: decodedCategory } },
    });
    if (categoryDoc) {
      whereCondition.categoryId = categoryDoc.id;
    } else {
      return res.status(200).json(
        new ApiResponse(200, {
          videos: [],
          pagination: { currentPage: pageNum, totalPages: 0, totalDocuments: 0, hasNextPage: false },
        }, "No videos for this category")
      );
    }
  }

  const totalDocuments = await Video.count({ where: whereCondition });
  const totalPages = Math.ceil(totalDocuments / limitNum);

  const videos = await Video.findAll({
    where: whereCondition,
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
    order: [["isTopVideo", "DESC"], ["createdAt", "DESC"]],
    offset: (pageNum - 1) * limitNum,
    limit: limitNum,
  });

  return res.status(200).json(
    new ApiResponse(200, {
      videos,
      pagination: { currentPage: pageNum, totalPages, totalDocuments, hasNextPage: pageNum < totalPages },
    }, "Videos fetched successfully")
  );
});

// ==================== GET VIDEO BY ID ====================
const getVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByPk(id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  });

  if (!video) throw new ApiError(404, "Video not found");

  await video.increment("views");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

// ==================== UPDATE VIDEO ====================
const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category, videoUrl, status } = req.body;

  if (!id || isNaN(Number(id))) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByPk(id);
  if (!video) throw new ApiError(404, "Video not found");

  if (title) video.title = title;
  if (description !== undefined) video.description = description;
  if (category) video.categoryId = category;
  if (status) video.status = status;

  if (videoUrl) {
    video.videoUrl = videoUrl;
    const ytId = getYoutubeVideoId(videoUrl);
    if (ytId && !req.file && (!video.thumbnail || video.thumbnail.includes('img.youtube.com'))) {
      video.thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }

  const thumbnailLocalPath = req.file?.path;
  if (thumbnailLocalPath) {
    const uploaded = await uploadOnCloudinary(thumbnailLocalPath);
    if (uploaded) video.thumbnail = uploaded.url;
  }

  await video.save();
  const populatedVideo = await Video.findByPk(video.id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, populatedVideo, "Video updated successfully"));
});

// ==================== DELETE VIDEO ====================
const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByPk(id);
  if (!video) throw new ApiError(404, "Video not found");

  await video.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// ==================== SET TOP VIDEO ====================
const setTopVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    throw new ApiError(400, "Invalid video ID");
  }

  // First, unset all top videos
  await Video.update({ isTopVideo: false }, { where: {} });

  // Set the target video as top
  const video = await Video.findByPk(id);
  if (!video) throw new ApiError(404, "Video not found");

  video.isTopVideo = true;
  await video.save();

  const populatedVideo = await Video.findByPk(id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, populatedVideo, "Video pinned to top successfully"));
});

export { createVideo, getVideos, getVideoById, updateVideo, deleteVideo, setTopVideo };
