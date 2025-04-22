import dotenv from "dotenv";
dotenv.config();

const config = {
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || "super-secret-key",
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || "86400", 10),
  },
  environment: process.env.NODE_ENV || "development",
  version: "1.0.0",
};

export default config;
