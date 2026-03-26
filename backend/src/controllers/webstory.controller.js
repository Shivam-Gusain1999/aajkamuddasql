import { WebStory, Category } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ==================== CREATE WEBSTORY ====================
const createWebStory = asyncHandler(async (req, res) => {
  const { title, category, status, articleUrl } = req.body;

  if (!title || !category) {
    throw new ApiError(400, "Title and category are required");
  }

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image file is required");
  }

  const uploaded = await uploadOnCloudinary(imageLocalPath);
  if (!uploaded) throw new ApiError(400, "Image upload failed");

  const story = await WebStory.create({
    title,
    categoryId: category,
    status: status || "DRAFT",
    image: uploaded.url,
    articleUrl: articleUrl || "",
  });

  const populatedStory = await WebStory.findByPk(story.id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, populatedStory, "Web Story created successfully"));
});

// ==================== GET WEBSTORIES ====================
const getWebStories = asyncHandler(async (req, res) => {
  const { status, limit } = req.query;

  const whereCondition = {};
  if (status) whereCondition.status = status;

  const queryOptions = {
    where: whereCondition,
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
  };

  if (limit) {
    queryOptions.limit = parseInt(limit);
  }

  const stories = await WebStory.findAll(queryOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, stories, "Web Stories fetched successfully"));
});

// ==================== GET WEBSTORY BY ID ====================
const getWebStoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    throw new ApiError(400, "Invalid WebStory ID");
  }

  const story = await WebStory.findByPk(id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  });

  if (!story) throw new ApiError(404, "Web Story not found");

  await story.increment("views");

  return res
    .status(200)
    .json(new ApiResponse(200, story, "Web Story fetched successfully"));
});

// ==================== UPDATE WEBSTORY ====================
const updateWebStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, category, status, articleUrl } = req.body;

  if (!id || isNaN(Number(id))) {
    throw new ApiError(400, "Invalid WebStory ID");
  }

  const story = await WebStory.findByPk(id);
  if (!story) throw new ApiError(404, "Web Story not found");

  if (title) story.title = title;
  if (category) story.categoryId = category;
  if (status) story.status = status;
  if (articleUrl !== undefined) story.articleUrl = articleUrl;

  const imageLocalPath = req.file?.path;
  if (imageLocalPath) {
    const uploaded = await uploadOnCloudinary(imageLocalPath);
    if (uploaded) story.image = uploaded.url;
  }

  await story.save();
  const populatedStory = await WebStory.findByPk(story.id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, populatedStory, "Web Story updated successfully"));
});

// ==================== DELETE WEBSTORY ====================
const deleteWebStory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    throw new ApiError(400, "Invalid WebStory ID");
  }

  const story = await WebStory.findByPk(id);
  if (!story) throw new ApiError(404, "Web Story not found");

  await story.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Web Story deleted successfully"));
});

export { createWebStory, getWebStories, getWebStoryById, updateWebStory, deleteWebStory };
