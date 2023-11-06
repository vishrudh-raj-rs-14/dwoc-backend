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

  const assignedOrgs = [];
  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    if (user?.assignedOrgs && user?.assignedOrgs.length > 0) {
      const org = user?.assignedOrgs.find((organisation: any) => {
        return organisation.id === issue.id;
      });
      if (org) {
        assignedOrgs.push(org);
      }
    }
  }
  const assignedOrgs_temp = issues
    .filter((issue: any) => {
      return issue.assignees.some(
        (assignee: any) => assignee.login === user?.githubHandle
      );
    })
    .map((issue: any) => ({
      issueId: issue.id,
      title: issue.title,
      issueLink: issue.html_url,
      repoLink: req.body.repoUrl,
      project: req.body.projectId,
      status: "Opened",
    }));
  const issue = assignedOrgs.find(
    (issue: any) => issue.id === assignedOrgs_temp[0].id
  );
  if (issue) {
    return res.status(400).json({
      status: "fail",
      message: "Issue already assigned",
    });
  }
  let c = 0;
  for (let i = 0; i < assignedOrgs_temp.length; i++) {
    const issue = assignedOrgs_temp[i];
    if (issue) {
      c += 1;
      assignedOrgs.push(issue);
    }
  }

  console.log(assignedOrgs);
  // if (c == 0 && assignedOrgs.length > 0) {
  //   return res.status(400).json({
  //     status: "fail",
  //     message: "No issue assigned",
  //   });
  // }

  await User.findByIdAndUpdate(
    user?._id,
    { assignedOrgs },
    {
      new: true,
      runValidators: true,
    }
  );

  if (assignedOrgs.length == 0) {
    return res.status(400).json({
      status: "fail",
      message: "No issue assigned",
    });
  }

  return res.status(201).json({
    status: "success",
    data: assignedOrgs,
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
  let score = user?.score as number;
  const responsee = await axios({
    url: `https://api.github.com/repos/${owner}/${repoName}/issues?state=closed&sort=updated`,
    method: "get",
    headers: { Authorization: "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" },
  });
  const issue = await responsee.data;
  let scoreval = 0;
  const closed: any = [];
  issue.map((el: any) => {
    if (el.title == req.params.title) {
      if (el.assignees[0].login === user?.githubHandle) {
        // console.log(
        //   `${user?.name} closed the PR and successfully solved the issue!!!`
        // );
        closed.push(el.id);
        el.labels.forEach((label: any) => {
          if (label.name.startsWith("level-")) {
            scoreval += Number(label.name.split("-")[1]) * 10;
          }
        });
      }
    }
  });

  const length = issue.length;
  let status;
  const assignedOrgs = user?.assignedOrgs;
  let finalStatus = "Opened";
  console.log(closed, assignedOrgs);
  if (length != 0) {
    assignedOrgs?.map((data: any) => {
      if (closed.includes(data.issueId)) {
        data.status = "Closed";
        finalStatus = "Closed";
        if (!data.scored) {
          score += scoreval;
        }
        data.scored = true;
      } else {
        // console.log(data.project, req.body.projectId);
        if (String(data.project) == String(req.body.projectId)) {
          finalStatus = "Open";
          data.status = "Open";
        }
      }
    });

    // if()
    await User.findByIdAndUpdate(
      user?.id,
      { assignedOrgs, score },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  return res.status(200).json({
    status: "success",
    data: "",
  });
});

export { validateAssigned, getIssues, validateClose };
