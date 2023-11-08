import expressAsyncHandler from "express-async-handler";
import Organisation from "../../models/organization.model";
import Project from "../../models/project.model";

const getAllProjects = expressAsyncHandler(async (req: any, res: any) => {
  const projects = await Project.find().populate("organisation");

  return res.status(200).json({
    status: "success",
    data: {
      projects,
    },
  });
});

const getProject = expressAsyncHandler(async (req: any, res: any) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Project not found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

export { getAllProjects, getProject };
