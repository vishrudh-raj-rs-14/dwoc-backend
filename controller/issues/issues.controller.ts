import expressAsyncHandler from "express-async-handler";
import Organisation from "../../models/organization.model";
import User from "../../models/user.model";
import axios from "axios";

const validateAssigned = expressAsyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user.id);
  const urlSegments = req.body.repoUrl.split("/");
  const owner = urlSegments[urlSegments.length - 2];
  const repoName = urlSegments[urlSegments.length - 1];
  const response = await axios({
    url: `https://api.github.com/repos/${owner}/${repoName}/issues?labels=dwoc`,
    method: "get",
  });

  const issues = await response.data;
  console.log(issues);

  const assignedOrgs = [];
  const assignedOrgs_temp = issues
    .filter((issue: any) =>
      issue.assignees.some(
        (assignee: any) => assignee.login === user?.githubHandle,
      ),
    )
    .map((issue: any) => ({
      title: issue.title,
      issueLink: issue.html_url,
      repoLink: req.params.repoUrl,
      status: "Opened",
    }));
  assignedOrgs.push(assignedOrgs_temp[0]);
  console.log(assignedOrgs_temp[0]);

  User.findByIdAndUpdate(
    user?.id,
    { assignedOrgs },
    {
      new: true,
      runValidators: true,
    },
  );

  return res.status(201).json({
    status: "success",
    data: response.data,
  });
});

const getIssues = expressAsyncHandler(async (req: any, res: any) => {
  const user_id = req.user;
  const user = await User.findById(user_id);
  const data = user?.assignedOrgs;

  return res.status(200).json({
    status: "success",
    data,
  });
});

const validateClose = expressAsyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user.id);
  const urlSegments = req.body.repoLink.split("/");
  const owner = urlSegments[urlSegments.length - 2];
  const repoName = urlSegments[urlSegments.length - 1];

  const responsee = await axios({
    url: `https://api.github.com/repos/${owner}/${repoName}/issues?state=closed&sort=updated`,
    method: "get",
    headers: { Authorization: "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" },
  });
  const issue = await responsee.data;

  issue.map((el: any) => {
    if (el.title == req.params.title) {
      console.log(el.assignees[0].login);
      if (el.assignees[0].login === user?.name) {
        console.log(
          `${user?.name} closed the PR and successfully solved the issue!!!`,
        );
      }
    }
  });

  const length = issue.length;
  let status;
  const assignedOrgs = user?.assignedOrgs;
  let finalStatus = "Opened";

  if (length != 0) {
    assignedOrgs?.map((data: any) => {
      if (data.title == req.params.title) {
        data.status = "Closed";
        finalStatus = "Closed";
      }
    });
    User.findByIdAndUpdate(
      user?.id,
      { assignedOrgs },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  return res.status(200).json({
    status: "success",
    data: finalStatus,
  });
});

export { validateAssigned, getIssues, validateClose };
