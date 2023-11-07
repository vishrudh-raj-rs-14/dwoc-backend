import express from "express";
import { protect } from "../../controller/user/user.controller";
import {
  getAllProjects,
  getProject,
} from "../../controller/projects/projects.controller";
const projectRouter = express.Router();
projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getProject);

export default projectRouter;
