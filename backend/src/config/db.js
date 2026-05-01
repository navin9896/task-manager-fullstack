const mongoose = require("mongoose");

async function connectDb(mongoUri) {
  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri);

  mongoose.connection.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err);
  });
}

module.exports = { connectDb };

