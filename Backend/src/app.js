import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// Restrict origins when using credentials. Expect comma-separated origins in CORS_ORIGIN
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy does not allow access from the specified Origin.'), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// //routes declaration
app.use("/api/users", userRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Service is healthy!" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export { app };