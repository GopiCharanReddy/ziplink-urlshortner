import express from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import urlRoute from "./routes/url.route.js";
import cookieParser from "cookie-parser";
import { ApiResponse } from "./utils/ApiResponse.js";
import {rateLimit} from 'express-rate-limit'
import z from 'zod';

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false
})
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ limit: "15kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(limiter)
app.use("/api/v1/user", userRoute);
app.use("/api/v1/url", urlRoute);

app.use((err, req, res, next) => {
  console.error(err);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong on the server." 
  if (err instanceof z.ZodError) {
        statusCode = 400;
        message = err.errors.map(validationErr => {
            return validationErr.path.length > 0
                ? `${validationErr.path.join('.')}: ${validationErr.message}`
                : validationErr.message;
        }).join('; '); 
    }
  res
    .status(statusCode)
    .json(new ApiResponse(statusCode, null, message));
});

export { app };