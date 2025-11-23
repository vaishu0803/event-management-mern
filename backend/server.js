// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// Create Express app
const app = express();

/* ---------------------------------------------
   MIDDLEWARE
--------------------------------------------- */

// Secure HTTP headers
app.use(helmet());

// Allow JSON parsing
app.use(express.json({ limit: "10kb" }));

// Clean MongoDB query injection like { "$gt": "" }
app.use(mongoSanitize());

// Logging (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// CORS policy (configure for Netlify later)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

// Prevent DDoS / abuse
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: "Too many requests, please try again later.",
  })
);

/* ---------------------------------------------
   ROUTES
--------------------------------------------- */
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

// Health check for Render
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is alive!" });
});

/* ---------------------------------------------
   DATABASE CONNECTION
--------------------------------------------- */
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

/* ---------------------------------------------
   GLOBAL ERROR HANDLING (optional but recommended)
--------------------------------------------- */

// If any route throws error → this handles it
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
