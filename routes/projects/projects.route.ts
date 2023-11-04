import express from "express";
import { protect } from "../../controller/user/user.controller";
import { getAllProjects } from "../../controller/projects/projects.controller";
const projectRouter = express.Router();

projectRouter.get("/", getAllProjects);

export default projectRouter;
