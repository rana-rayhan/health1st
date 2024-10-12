const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const userRouter = require("./routers/usersRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRoute");
const commentRouter = require("./routers/commentRouter");
const { clientUrl } = require("./secret");
//
//
// express app
const app = express();
//
//
//
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // Limit each IP to 5 requests per `window` (here, per 1 minutes)
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
//
//
// Midlewares
const corsOptions = {
  origin: clientUrl,
  credentials: true,
};

app.use(cookieParser());
app.use(limiter);
app.use(cors(corsOptions));
app.use(xssClean());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
//
// use all route
app.use("/api/seed", seedRouter);
//
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
//post route
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
//
//
// client error handle
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});
//
//
// server error handle --> handle all error
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});
//
// export app
module.exports = app;
