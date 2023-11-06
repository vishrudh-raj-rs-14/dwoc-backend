import express from "express";
import dotenv from "dotenv";
dotenv.config({
  path: __dirname.replace("build", ".env"),
});
import connectDatabase from "./utils/connectDatabase";
import config from "./config/config";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundErr } from "./middleware/errorHandler";
import userRouter from "./routes/user/user.routes";
import orgRouter from "./routes/organisations/organisations.route";
import projectRouter from "./routes/projects/projects.route";
import { LeaderBoardRouter } from "./routes/leaderboard/leaderboard.route";
import { googleOauthHandler } from "./controller/auth/googleAuthHandler";
import { issuesRouter } from "./routes/issues/issues.route";

connectDatabase(config.db);
const app = express();

// Neccessary Middlewares
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(
  cors({
    origin: ["http://localhost:9000", process.env.FRONTEND_URL as string],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:9000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/organisations", orgRouter);
app.use("/api/projects", projectRouter);
app.use("/api/leaderboard", LeaderBoardRouter);
app.use("/api/issues", issuesRouter);

app.use(notFoundErr);
app.use(errorHandler);

app.listen(config.port);
