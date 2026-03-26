import { Sequelize } from "sequelize";

let sequelize;

// Support full DATABASE_URL or individual credentials
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: process.env.NODE_ENV !== "production" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      dialect: "mysql",
      logging: process.env.NODE_ENV !== "production" ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions: process.env.DB_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`\n ✅ MySQL connected !! DB HOST: ${process.env.DB_HOST || 'via DATABASE_URL'}`);
    
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log(" ✅ All tables synced successfully");
  } catch (error) {
    console.log("MySQL connection FAILED ", error);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
