import express from "express";
import cors from "cors";
import logger from "./utils/logger.js";
import inspirationRoute from "./router/inspiration.router.js";

const app = express();

app.use(cors());

app.use((req, res, next) => {
  const { method, url } = req;

  logger.info(`${method} Request: URL [${url}]`);
  next();
});

app.use("/inspiration", inspirationRoute);

app.get("/", (_req, res) => {
  res.json({ timestamp: new Date().toISOString() });
});

export default app;
