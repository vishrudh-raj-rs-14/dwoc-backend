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

const getProject = expressAsyncHandler(async (req: any, res: any) => {
  const project = await Project.findById(req.params.id);

  // const project = {
  //   name: newProject?.name,
  //   organisation: newProject?.organisation.id,
  //   OrganisationName: newProject?.organisation.name
  //   techStack: newProject?.techStack,
  //   description: newProject?.description,
  //   miniDescription: newProject?.miniDescription,
  //   tags: newProject?.tags,
  //   githubUrl: newProject?.githubUrl,
  // };
  console.log(project);

  return res.status(201).json({
    status: "success",
    data: {
      project,
    },
  });
});

export { getAllProjects, getProject };
