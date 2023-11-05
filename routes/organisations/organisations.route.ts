import express from "express";
import {
  createOrganisation,
  getAllOrganisations,
  getOrganisation,
  getOrganisationProjects,
  createOrganisationProject,
  restrictToOwner,
} from "../../controller/organisations/organisations.controller";
import { protect } from "../../controller/user/user.controller";
const orgRouter = express.Router();

orgRouter.get("/", getAllOrganisations);
orgRouter.get("/:id", getOrganisation);
orgRouter.get("/:id/projects", getOrganisationProjects);
orgRouter.post("/", protect, createOrganisation);
orgRouter.post(
  "/projects",
  protect,
  restrictToOwner,
  createOrganisationProject,
);
export default orgRouter;
