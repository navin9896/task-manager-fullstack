function readBool(val, defaultValue = false) {
  if (val == null) return defaultValue;
  return String(val).toLowerCase() === "true";
}

const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  MONGODB_URI: process.env.MONGODB_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  CORS_CREDENTIALS: readBool(process.env.CORS_CREDENTIALS, false),
  SERVE_STATIC: readBool(process.env.SERVE_STATIC, false),
});

if (!env.MONGODB_URI) {
  throw new Error("Missing required env var: MONGODB_URI");
}

module.exports = { env };

