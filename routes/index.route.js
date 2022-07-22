import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import postRoute from "./post.route.js";
import uploadRoute from "./upload.route.js";
import appError from "../utils/appError.js";
import errorMiddleware from "./../middlewares/error.middleware.js";

const initRoute = (app) => {
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/post", postRoute);
  app.use("/api/upload", uploadRoute);

  app.use("*", (req, res, next) => {
    const message = `Cant not find ${req.originalUrl}`;
    next(new appError(message, 404));
  });

  app.use(errorMiddleware);
};

export default initRoute;
