import expressAsyncHandler from "express-async-handler";
import Organisation from "../../models/organization.model";
import Project from "../../models/project.model";

const getAllProjects = expressAsyncHandler(async (req: any, res: any) => {
  const projects = await Project.find();

  return res.status(201).json({
    status: "success",
    data: {
      projects,
    },
  });
});

export { getAllProjects };
