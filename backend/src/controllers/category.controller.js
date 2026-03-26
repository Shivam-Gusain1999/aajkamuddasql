import { Category } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Category name is required");
  }

  const nameToLowerCase = name.toLowerCase().trim();

  // Check if category already exists
  const existingCategory = await Category.findOne({
    where: { name: nameToLowerCase },
  });
  if (existingCategory) {
    throw new ApiError(409, "Category with this name already exists");
  }

  const category = await Category.create({
    name: nameToLowerCase,
    description: description?.trim(),
  });

  if (!category) {
    throw new ApiError(500, "Failed to create category");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({
    order: [["createdAt", "DESC"]],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Category name is required");
  }

  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  category.name = name.toLowerCase().trim();
  if (description) {
    category.description = description.trim();
  }

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found or already deleted");
  }

  await category.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export { createCategory, getAllCategories, updateCategory, deleteCategory };
