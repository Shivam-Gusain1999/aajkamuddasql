import { Comment, Article, User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getArticleComments = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!articleId || isNaN(Number(articleId))) {
    throw new ApiError(400, "Invalid Article ID");
  }

  const article = await Article.findByPk(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  const comments = await Comment.findAll({
    where: {
      articleId,
      status: "Approved",
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "fullName", "username", "avatar"],
      },
    ],
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;

  if (!articleId || isNaN(Number(articleId))) {
    throw new ApiError(400, "Invalid Article ID");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  const article = await Article.findByPk(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  const comment = await Comment.create({
    content: content.trim(),
    articleId,
    authorId: req.user.id,
    status: "Approved",
  });

  if (!comment) {
    throw new ApiError(500, "Error while adding comment");
  }

  // Fetch with author details so frontend can display name immediately
  const populatedComment = await Comment.findByPk(comment.id, {
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "fullName", "username", "avatar"],
      },
    ],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, populatedComment, "Comment added successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || isNaN(Number(commentId))) {
    throw new ApiError(400, "Invalid Comment ID");
  }

  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Only allow deletion if the user is the author of the comment or an Admin
  if (
    comment.authorId.toString() !== req.user.id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    throw new ApiError(
      403,
      "You do not have permission to delete this comment"
    );
  }

  await comment.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

// Controller for admin to fetch all comments
const getAllCommentsForAdmin = asyncHandler(async (req, res) => {
  const comments = await Comment.findAll({
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "fullName", "username"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "All comments fetched successfully"));
});

// Controller for admin to update comment status
const updateCommentStatus = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { status } = req.body;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const comment = await Comment.findByPk(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  comment.status = status;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment status updated"));
});

export { getArticleComments, addComment, deleteComment, getAllCommentsForAdmin, updateCommentStatus };
