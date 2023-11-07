import express from "express";
import {
  createOrganisation,
  getAllOrganisations,
  getOrganisationProjects,
  createOrganisationProject,
  restrictToOwner,
  deleteOrganisationProject,
} from "../../controller/organisations/organisations.controller";
import { protect } from "../../controller/user/user.controller";
const orgRouter = express.Router();

orgRouter.get("/", getAllOrganisations);
// orgRouter.get("/:id", getOrganisation);
orgRouter.get("/projects", protect, restrictToOwner, getOrganisationProjects);
orgRouter.post("/", protect, createOrganisation);
orgRouter.post(
  "/projects",
  protect,
  restrictToOwner,
  createOrganisationProject,
);

orgRouter.delete(
  "/projects/:id",
  protect,
  restrictToOwner,
  deleteOrganisationProject
);
export default orgRouter;
