import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Video = sequelize.define(
  "Video",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING(500), // Cloudinary URL or YouTube thumbnail
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("DRAFT", "PUBLISHED", "ARCHIVED"),
      defaultValue: "DRAFT",
    },
    isTopVideo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "videos",
    timestamps: true,
    indexes: [
      { fields: ["status", "createdAt"] },
      { fields: ["categoryId", "status", "createdAt"] },
    ],
  }
);

export { Video };
