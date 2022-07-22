import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import initRoute from "./routes/index.route.js";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

app.use(express.static("public"));
app.use("/images", express.static("images"));

// config route
initRoute(app);

mongoose
  .connect(process.env.CONNECT_DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("<<<<< Connected to database");
  });

app.listen(port, () => {
  console.log("<<<<< Server is start on port " + port);
});
