import asyncHandler from "express-async-handler";
import User from "../../models/user.model";
import { generateMockUserData } from "../../utils/faker";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const jwtVerifyPromisified = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, {}, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

const protect = asyncHandler(async (req: any, res: any, next: any) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies["dwocToken"]) {
    token = req.cookies["dwocToken"];
  }
  if (!token) {
    res.status(403);
    return next(new Error("You must login to access this page"));
  }
  const decoded: any = await jwtVerifyPromisified(
    token,
    process.env.JWT_SECRET as string
  );
  console.log(decoded);
  const user = await User.findById(decoded.id).lean();
  if (!user) {
    res.status(401);
    return next(
      new Error("The user with this credentials does not exist anymore")
    );
  }
  req.user = user;
  next();
});

const getUserData = asyncHandler(async (req: any, res: any, next: any) => {
  const user = await User.findById(String(req.user._id));
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  return res.json({
    name: user.name,
    githubHandle: user.githubHandle,
  });
});

const register = asyncHandler(async (req: any, res: any, next: any) => {
  const user = await User.findById(String(req.user._id));
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.isFilled) {
    res.status(400).json({
      status: "fail",
      message: "User already registered",
    });
  }
  console.log(
    !req.body.githubHandle,
    !req.body.college,
    !req.body.phone,
    !req.body.address,
    !req.body.tshirtSize,
    req.body.isOrg
  );
  if (
    !req.body.githubHandle ||
    !req.body.college ||
    !req.body.phone ||
    !req.body.address ||
    !req.body.tshirtSize ||
    typeof req.body.isOrg !== "boolean"
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const newUser = await User.findByIdAndUpdate(
    String(req.user._id),
    {
      githubHandle: req.body.githubHandle,
      college: req.body.college,
      phone: req.body.phone,
      isOrg: req.body.isOrg,
      address: req.body.address,
      tshirtSize: req.body.tshirtSize,
      isFilled: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.json(newUser);
});

const getProfile = asyncHandler(async (req: any, res: any, next: any) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  return res.json({
    isLoggedIn: true,
    user: {
      name: user.name,
      email: user.email,
      githubHandle: user.githubHandle,
      isOrg: user.isOrg,
      isFilled: user.isFilled,
      college: user.college,
      phone: user.phone,
      address: user.address,
      tshirtSize: user.tshirtSize,
      isAdmin: user.isAdmin,
    },
  });
});

const isLoggedIn = asyncHandler(async (req: any, res: any, next: any) => {
  const user = await User.findById(String(req.user._id));
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  return res.json({
    name: user.name,
    email: user.email,
    githubHandle: user.githubHandle,
    isOrg: user.isOrg,
    isFilled: user.isFilled,
    college: user.college,
    phone: user.phone,
    address: user.address,
    tshirtSize: user.tshirtSize,
    isAdmin: user.isAdmin,
  });
});

const updateProfile = asyncHandler(async (req: any, res: any, next: any) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const newUser = await User.findByIdAndUpdate(
    req.params.userId,
    {
      college: req.body.college,
      phone: req.body.phone,
      address: req.body.address,
      tshirtSize: req.body.tshirtSize,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.json(newUser);
});

const generateMockUsers = asyncHandler(
  async (req: any, res: any, next: any) => {
    console.log("here");
    await generateMockUserData();
    return res.json({
      status: "success",
    });
  }
);

export {
  protect,
  getUserData,
  getProfile,
  updateProfile,
  register,
  generateMockUsers,
  isLoggedIn,
};
