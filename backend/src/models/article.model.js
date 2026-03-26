import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(600),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING(500), // Cloudinary URL
      defaultValue: "",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("DRAFT", "PUBLISHED", "ARCHIVED"),
      defaultValue: "DRAFT",
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "articles",
    timestamps: true,
    indexes: [
      { fields: ["status", "createdAt"] },
      { fields: ["categoryId", "status", "createdAt"] },
      { fields: ["slug"] },
    ],
  }
);

export { Article };
