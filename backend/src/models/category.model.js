import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "categories",
    timestamps: true,
  }
);

export { Category };
