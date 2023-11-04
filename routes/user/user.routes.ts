import express from "express";
const userRouter = express.Router();

import { googleOauthHandler } from "../../controller/auth/googleAuthHandler";
import { getGoogleOauthURL } from "../../controller/auth/googleAuthUrl.controller";
import {
  getUserData,
  protect,
  getProfile,
  updateProfile,
  register,
  generateMockUsers,
  isLoggedIn,
} from "../../controller/user/user.controller";

userRouter.get("/mock", generateMockUsers);
userRouter.get("/profile", protect, isLoggedIn);
userRouter.get("/profile/:userId", generateMockUsers);

userRouter.put("/register", protect, register);
userRouter.put("/profile/:userId", protect, updateProfile);

userRouter.get("/getGoogleOauthURL", getGoogleOauthURL);

// userRouter.get("/:userId", protect, getUserData);

export default userRouter;
