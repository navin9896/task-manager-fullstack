const http = require("http");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

require("./config/loadEnv");

const { connectDb } = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");
const { env } = require("./config/env");

async function bootstrap() {
  await connectDb(env.MONGODB_URI);

  const app = express();

  app.disable("x-powered-by");

  app.use(helmet());
  const allowedOrigins =
    env.CORS_ORIGIN === "*"
      ? "*"
      : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (allowedOrigins === "*") return callback(null, true);
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("CORS origin not allowed."));
      },
      credentials: env.CORS_CREDENTIALS,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  }

  app.get("/health", (req, res) => {
    res.json({ ok: true, service: "task-manager-api" });
  });

  app.use("/api/tasks", taskRoutes);

  // Optional static hosting for deployments where backend serves frontend build
  if (env.SERVE_STATIC) {
    const distPath = path.resolve(
      __dirname,
      "..",
      "..",
      "frontend",
      "task-manager",
      "dist",
      "task-manager",
      "browser"
    );
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.use(notFound);
  app.use(errorHandler);

  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal startup error:", err);
  process.exit(1);
});

