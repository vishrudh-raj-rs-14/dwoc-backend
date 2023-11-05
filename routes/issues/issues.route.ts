import express from "express";

import {
  validateAssigned,
  getIssues,
} from "../../controller/issues/issues.controller";
const issuesRouter = express.Router();

issuesRouter.get("/get", getIssues);

issuesRouter.get("/validate", validateAssigned);

export { issuesRouter };
