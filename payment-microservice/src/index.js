// src/index.js
import "dotenv/config";
import http from "http";
import app from "./app.js";
import config from "./config/index.js";
import logger from "./config/logger.js";

const server = http.createServer(app);

server.listen(config.PORT, () => {
  const protocol = config.NODE_ENV === "production" ? "https" : "http";
  const host = config.HOST || "localhost";

  const baseURL = `${protocol}://${host}:${config.PORT}`;

  logger.info(
    `Payment microservice running at ${baseURL} (env=${config.NODE_ENV})`
  );
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
