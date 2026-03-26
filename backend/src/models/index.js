// Central model index — defines all associations (JOINs)
import { User } from "./user.model.js";
import { Article } from "./article.model.js";
import { Category } from "./category.model.js";
import { Comment } from "./comment.model.js";
import { Ad } from "./ad.model.js";
import { Settings } from "./settings.model.js";
import { Video } from "./video.model.js";
import { WebStory } from "./webstory.model.js";

// ==================== ASSOCIATIONS ====================

// User → Articles (One-to-Many)
User.hasMany(Article, { foreignKey: "authorId", as: "articles" });
Article.belongsTo(User, { foreignKey: "authorId", as: "author" });

// Category → Articles (One-to-Many)
Category.hasMany(Article, { foreignKey: "categoryId", as: "articles" });
Article.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Article → Comments (One-to-Many)
Article.hasMany(Comment, { foreignKey: "articleId", as: "comments" });
Comment.belongsTo(Article, { foreignKey: "articleId", as: "article" });

// User → Comments (One-to-Many)
User.hasMany(Comment, { foreignKey: "authorId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "authorId", as: "author" });

// Category → Videos (One-to-Many)
Category.hasMany(Video, { foreignKey: "categoryId", as: "videos" });
Video.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Category → WebStories (One-to-Many)
Category.hasMany(WebStory, { foreignKey: "categoryId", as: "webstories" });
WebStory.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

export { User, Article, Category, Comment, Ad, Settings, Video, WebStory };
