import asyncHandler from "express-async-handler";
import User from "../../models/user.model";

const getLeaderboard = asyncHandler(async (req: any, res: any) => {
  const page = req.query.page || 1;
  const limit = 5;
  let curUser = req.user;
  let allUsers = await User.find().sort({ score: -1 }).lean();
  const totalPages = Math.ceil(allUsers.length / limit);
  let users = await User.find()
    .sort({ score: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  allUsers = allUsers
    .map((ele, i) => {
      if (String(curUser._id) == String(ele._id)) {
        curUser = { ...curUser, rank: i + 1 };
      }
      return { ...ele, rank: i + 1 };
    })
    .slice((page - 1) * limit, (page - 1) * limit + limit + 1)
    .filter((ele: any, i: number) => {
      return String(ele._id) != String(curUser._id);
    });

  console.log(allUsers);

  return res.status(200).json({
    status: "success",
    data: {
      count: users.length,
      currentUser: curUser,
      leaderboard: allUsers,
      page: page,
      totalPages: totalPages,
    }
  });
});

export { getLeaderboard };
