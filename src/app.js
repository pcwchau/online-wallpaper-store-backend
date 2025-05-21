import express from "express";
import cors from "cors";
import logger from "./utils/logger.js";
import inspirationRouter from "./router/inspiration.router.js";

const app = express();

app.use(cors());

app.use((req, _res, next) => {
  const { method, url } = req;
  logger.info(`${method} Request: URL [${url}]`);
  next();
});

// Health check
app.get("/", (_req, res) => {
  res.json({ timestamp: new Date().toISOString() });
});

// Router
app.use("/inspiration", inspirationRouter);

// Error Handler
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode ?? 500;
  if (statusCode === 500) logger.error(err.stack);
  else logger.error(err.message);
  res.status(statusCode).json({
    status: "error",
    code: statusCode === 500 ? "INTERNAL_ERROR" : err.errorCode,
    message: statusCode === 500 ? "Internal Server Error." : err.message,
    timestamp: new Date().toISOString(),
  });
});

export default app;
