import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Ad = sequelize.define(
  "Ad",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("banner", "script"),
      defaultValue: "banner",
    },
    placement: {
      type: DataTypes.ENUM("sidebar", "feed", "both"),
      defaultValue: "both",
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    scriptCode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "ads",
    timestamps: true,
  }
);

export { Ad };
