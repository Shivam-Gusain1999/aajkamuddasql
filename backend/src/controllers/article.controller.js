import { Article, Category, User } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Op } from "sequelize";

// Utility: Generate SEO-friendly slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, "-");
};

// ==================== CREATE ARTICLE ====================
const createArticle = asyncHandler(async (req, res) => {
  const { title, content, category, status } = req.body;

  let thumbnailUrl = "";

  const thumbnailLocalPath = req.file?.path;
  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (thumbnail) {
      thumbnailUrl = thumbnail.url;
    } else {
      console.warn("Cloudinary upload failed, saving article without thumbnail");
    }
  }

  let slug = generateSlug(title);
  const existingArticle = await Article.findOne({ where: { slug } });
  if (existingArticle) {
    slug = `${slug}-${Date.now()}`;
  }

  const article = await Article.create({
    title,
    slug,
    content,
    categoryId: category,
    authorId: req.user.id,
    thumbnail: thumbnailUrl,
    status: status || "DRAFT",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, article, "Article created successfully"));
});

// ==================== GET ARTICLES (PUBLIC + SMART FILTER) ====================
const getArticles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, search } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const whereCondition = { status: "PUBLISHED" };

  // SMART CATEGORY FILTERING — case-insensitive for Hindi/English
  if (category) {
    try {
      const decodedCategory = decodeURIComponent(category).trim();
      const categoryDoc = await Category.findOne({
        where: {
          name: { [Op.like]: decodedCategory },
        },
      });

      if (categoryDoc) {
        whereCondition.categoryId = categoryDoc.id;
      } else {
        return res.status(200).json(
          new ApiResponse(200, {
            articles: [],
            pagination: {
              currentPage: pageNum,
              totalPages: 0,
              totalDocuments: 0,
              hasNextPage: false,
            },
          }, "No articles found for this category")
        );
      }
    } catch (error) {
      console.error("Category matching error: ", error);
      throw new ApiError(500, "Error while filtering category");
    }
  }

  // 🔍 Search Logic
  if (search) {
    whereCondition[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { content: { [Op.like]: `%${search}%` } },
    ];
  }

  // Get total count for pagination metadata
  const totalDocuments = await Article.count({ where: whereCondition });
  const totalPages = Math.ceil(totalDocuments / limitNum);

  const articles = await Article.findAll({
    where: whereCondition,
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "fullName", "avatar", "username"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
    offset: (pageNum - 1) * limitNum,
    limit: limitNum,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        articles,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalDocuments,
          hasNextPage: pageNum < totalPages,
        },
      },
      "Articles fetched successfully"
    )
  );
});

// ==================== GET ARTICLE BY SLUG (PUBLIC) ====================
const getArticleBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const article = await Article.findOne({
    where: { slug, status: "PUBLISHED" },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "fullName", "avatar", "username"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  // Increment views
  await article.increment("views");

  return res
    .status(200)
    .json(new ApiResponse(200, article, "Article fetched successfully"));
});

// ==================== UPDATE ARTICLE ====================
const updateArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { title, content, category, status } = req.body;

  const article = await Article.findByPk(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  // Only author or admin can update
  if (
    article.authorId.toString() !== req.user.id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    throw new ApiError(403, "You don't have permission to update this article");
  }

  if (title) {
    article.title = title;
    article.slug = generateSlug(title);
    // Check slug uniqueness
    const existing = await Article.findOne({
      where: {
        slug: article.slug,
        id: { [Op.ne]: articleId },
      },
    });
    if (existing) article.slug = `${article.slug}-${Date.now()}`;
  }
  if (content) article.content = content;
  if (category) article.categoryId = category;
  if (status) article.status = status;

  // Handle new thumbnail if uploaded
  const thumbnailLocalPath = req.file?.path;
  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (thumbnail) article.thumbnail = thumbnail.url;
  }

  await article.save();

  return res
    .status(200)
    .json(new ApiResponse(200, article, "Article updated successfully"));
});

// ==================== DELETE ARTICLE ====================
const deleteArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const article = await Article.findByPk(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  // Only author or admin can delete
  if (
    article.authorId.toString() !== req.user.id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    throw new ApiError(403, "You don't have permission to delete this article");
  }

  await article.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Article deleted successfully"));
});

export {
  createArticle,
  getArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
};