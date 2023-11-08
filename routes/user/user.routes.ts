import express from "express";
const userRouter = express.Router();

import { googleOauthHandler } from "../../controller/auth/googleAuthHandler";
import {
  getUserData,
  protect,
  getProfile,
  updateProfile,
  register,
  generateMockUsers,
  isLoggedIn,
  logout,
} from "../../controller/user/user.controller";
import { getOrganisation } from "../../controller/organisations/organisations.controller";

// userRouter.get("/mock", generateMockUsers);
userRouter.get("/profile", protect, isLoggedIn);
// userRouter.get("/profile/:userId", generateMockUsers);
userRouter.get("/logout", logout);

userRouter.get("/organisation", protect, getOrganisation);
userRouter.put("/register", protect, register);
userRouter.put("/profile", protect, updateProfile);

userRouter.post("/oauth/google", googleOauthHandler);

// userRouter.get("/:userId", protect, getUserData);

export default userRouter;
