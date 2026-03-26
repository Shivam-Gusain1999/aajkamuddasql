import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("username", value?.toLowerCase()?.trim());
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("email", value?.toLowerCase()?.trim());
      },
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        this.setDataValue("fullName", value?.trim());
      },
    },
    avatar: {
      type: DataTypes.STRING(500), // Cloudinary URL
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("USER", "REPORTER", "EDITOR", "ADMIN"),
      defaultValue: "USER",
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

// Instance methods
User.prototype.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

User.prototype.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export { User };
