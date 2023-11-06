import expressAsyncHandler from "express-async-handler";
import Organisation from "../../models/organization.model";
import Project from "../../models/project.model";

const getAllProjects = expressAsyncHandler(async (req: any, res: any) => {
  const projects = await Project.find().populate("organisation");

  return res.status(201).json({
    status: "success",
    data: {
      projects,
    },
  });
});

const getProject = expressAsyncHandler(async (req: any, res: any) => {
  const project = await Project.findById(req.params.id);

  console.log(project);

  return res.status(201).json({
    status: "success",
    data: {
      project,
    },
  });
});

export { getAllProjects, getProject };
