import expressAsyncHandler from "express-async-handler";
import Organisation from "../../models/organization.model";
import Project from "../../models/project.model";
import axios from "axios";

const validateAssigned = expressAsyncHandler(async (req: any, res: any) => {
  ///repos/{owner}/{repo}/assignees
  // repos/{owner}/{repo}/labels/{name}
  // const user = await User.findById();

  const user = {
    id: "r3fe89f7d89",
    name: "vishrudh-raj-rs-14",
  };
  const response = await axios({
    // url: "https://api.github.com/repos/meshery/meshery/issues?labels=area/ux",
    url: "https://api.github.com/repos/delta/dwoc-backend-23/issues?labels=Leaderboard",

    method: "get",
  });

  const issues = await response.data;
  console.log(issues);

  const assignedOrgs = [];
  const assignedOrgs_temp = issues
    .filter((issue: any) =>
      issue.assignees.some((assignee: any) => assignee.login === user.name),
    )
    .map((issue: any) => ({
      title: issue.title,
      issueLink: issue.html_url,
      githubLink: `https://github.com/meshery`,
    }));
  assignedOrgs.push(assignedOrgs_temp[0]);
  console.log(assignedOrgs_temp[0]);
  // User.findByIdAndUpdate( user.id, { assignedOrgs },  {
  //   new: true,
  //   runValidators: true,
  // })

  return res.status(201).json({
    status: "success",
    data: response.data,
  });
});

const getIssues = expressAsyncHandler(async (req: any, res: any) => {
  // const issues = [
  //   {
  //     issueLink: "https://github.com/meshery/meshery/issues/8749",
  //     githubLink: "https://github.com/meshery",
  //   },
  //   {
  //     issueLink: "https://github.com/meshery/meshery/issues/8749",
  //     githubLink: "https://github.com/meshery",
  //   },
  //   {
  //     issueLink: "https://github.com/meshery/meshery/issues/8749",
  //     githubLink: "https://github.com/meshery",
  //   },
  // ];

  ///repos/{owner}/{repo}/issues/{issue_number}
  // GET /repos/{owner}/{repo}/pulls/{pull_number}/merge
  const data = {
    title: "This is a PR to be done properly please dont mess",
    issueLink: "https://github.com/meshery/meshery/issues/9301",
    githubLink: `https://github.com/meshery`,
  };
  const responsee = await axios({
    url: "https://api.github.com/repos/meshery/meshery/pulls/9305/merge",
    method: "get",
  });
  const issuess = await responsee.data;

  console.log(issuess);

  return res.status(200).json({
    status: "success",
    data,
  });
});

export { validateAssigned, getIssues };
