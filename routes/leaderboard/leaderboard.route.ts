import { Router } from "express";
import { getLeaderboard } from "../../controller/leaderboard/leaderboard.controller";
import { protect } from "../../controller/user/user.controller";

const express = require("express");

const LeaderBoardRouter = express.Router();

LeaderBoardRouter.get("/", protect, getLeaderboard);

export { LeaderBoardRouter };
