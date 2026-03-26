import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Settings = sequelize.define(
  "Settings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    siteName: {
      type: DataTypes.STRING(255),
      defaultValue: "Aaj Ka Mudda",
      allowNull: false,
    },
    contactEmail: {
      type: DataTypes.STRING(255),
      defaultValue: "admin@aajkamudda.com",
      allowNull: false,
    },
    seoDescription: {
      type: DataTypes.TEXT,
      defaultValue: "The latest news and updates.",
    },
    facebookUrl: {
      type: DataTypes.STRING(500),
      defaultValue: "https://facebook.com",
    },
    twitterUrl: {
      type: DataTypes.STRING(500),
      defaultValue: "https://twitter.com",
    },
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "settings",
    timestamps: true,
  }
);

export { Settings };
