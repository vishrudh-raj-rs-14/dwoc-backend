import expressAsyncHandler from "express-async-handler";
import Organisation from "../../models/organization.model";
import User from "../../models/user.model";
import axios from "axios";

const validateAssigned = expressAsyncHandler(async (req: any, res: any) => {
  const user = req.user;
  const urlSegments = req.body.repoUrl.split("/");
  const owner = urlSegments[urlSegments.length - 2];
  const repoName = urlSegments[urlSegments.length - 1];
  const response = await axios({
    url: `https://api.github.com/repos/${owner}/${repoName}/issues?labels=dwoc`,
    method: "get",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
    },
  });
  const issues = await response.data;

  let issueList = (user?.assignedOrgs as any) || [];
  if (issueList && issueList.length > 0) {
    issueList = issueList.filter((issue: any) => {
      return !issues.some((ele: any) => ele.id === issue.issueId);
    });
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

  if (assignedOrgs_temp.length == 0) {
    return res.status(400).json({
      status: "fail",
      message: "No issue assigned",
    });
  }
  // let c = 0;
  for (let i = 0; i < assignedOrgs_temp.length; i++) {
    const issue = assignedOrgs_temp[i];
    if (issue) {
      issueList.push(issue);
    }
  }

  console.log(issueList, assignedOrgs_temp);
  // console.log(assignedOrgs);
  // if (c == 0 && assignedOrgs.length > 0) {
  //   return res.status(400).json({
  //     status: "fail",
  //     message: "No issue assigned",
  //   });
  // }

  await User.findByIdAndUpdate(
    user?._id,
    { assignedOrgs: issueList },
    {
      new: true,
      runValidators: true,
    }
  );

  if (assignedOrgs_temp.length == 0) {
    return res.status(400).json({
      status: "fail",
      message: "No issue assigned from this project",
    });
  }

  return res.status(201).json({
    status: "success",
    data: issueList,
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
  const user = req.user;
  const urlSegments = req.body.repoLink.split("/");
  const owner = urlSegments[urlSegments.length - 2];
  const repoName = urlSegments[urlSegments.length - 1];
  let score = user?.score as number;
  const responsee = await axios({
    url: `https://api.github.com/repos/${owner}/${repoName}/issues?state=closed&sort=updated`,
    method: "get",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
    },
  });
  const issue = await responsee.data;
  let status = 0;
  let scoreval = 0;
  const closed: any = [];

  issue.map((el: any) => {
    if (el.id == req.body.issueId) {
      status = 1;
      if (el.assignees[0].login === user?.githubHandle) {
        status = 2;
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
          status = 4;
        } else {
          status = 3;
        }
        data.scored = true;
      }
      // else {
      //   // console.log(data.project, req.body.projectId);
      //   if (String(data.project) == String(req.body.projectId)) {
      //     finalStatus = "Open";
      //     data.status = "Open";
      //   }
      // }
    });

    // if()
    await User.findByIdAndUpdate(
      String(user._id),
      { assignedOrgs, score },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  console.log(status);

  if (status == 0) {
    return res.status(400).json({
      status: "fail",
      message: "No such issue was closed",
    });
  } else if (status == 1) {
    return res.status(400).json({
      status: "fail",
      message: "You did not close the issue",
    });
  } else if (status == 2) {
    return res.status(200).json({
      status: "success",
      message: "You closed the issue",
    });
  } else if (status == 3) {
    return res.status(400).json({
      status: "fail",
      message: "You have already scored for this issue",
    });
  } else if (status == 4) {
    return res.status(200).json({
      status: "success",
      message: "You closed the issue and scored",
    });
  }

  return res.status(200).json({
    status: "success",
    data: "",
  });
});

export { validateAssigned, getIssues, validateClose };
