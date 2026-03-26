import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const WebStory = sequelize.define(
  "WebStory",
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
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
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
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    articleUrl: {
      type: DataTypes.STRING(500),
      defaultValue: "",
    },
  },
  {
    tableName: "webstories",
    timestamps: true,
  }
);

export { WebStory };
