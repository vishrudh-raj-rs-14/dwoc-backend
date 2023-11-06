import express from "express";

import {
  validateAssigned,
  getIssues,
  validateClose,
} from "../../controller/issues/issues.controller";
import { protect } from "../../controller/user/user.controller";

const issuesRouter = express.Router();

issuesRouter.get("/get", protect, getIssues);

issuesRouter.post("/validate", protect, validateAssigned);
issuesRouter.post("/check/:title", protect, validateClose);

export { issuesRouter };
