import User from "../../models/user.model";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./../.env" });
const axios = require("axios");
const qs = require("qs");

const createJWTtoken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
};

const CreateAndSendToken = (user: any, statusCode: Number, res: any) => {
  const token = createJWTtoken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  //   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("dwocToken", token, cookieOptions);

  user.password = undefined;
};

const getGoogleOauthTokens = async (code: any) => {
  try {
    const url = "https://oauth2.googleapis.com/token";

    const value = {
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URL,
      client_secret: process.env.CLIENT_SECRET_GOOGLE_OAUTH,
      client_id: process.env.CLIENT_ID_GOOGLE_OAUTH,
      grant_type: "authorization_code",
    };

    const res = await axios.post(url, qs.stringify(value), {
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (err) {}
};

const getGoogleUser = async ({ id_token, access_token }: any) => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        header: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const findAndUpdateUser = async (query: any, update: any, options: any) => {
  return await User.findOneAndUpdate(query, update, options);
};

const googleOauthHandler = async (req: any, res: any, next: any) => {
  try {
    const code = req.body.code;

    const { id_token, access_token } = await getGoogleOauthTokens(code);

    const googleUser = await getGoogleUser({ id_token, access_token });

    if (!googleUser.verified_email) {
      return res.status(403).json({
        status: "fail",
        message: "google account is not verified",
      });
    }
    const user = await User.findOne({ email: googleUser.email });
    if (user) {
      res.status(409);
      return next(new Error("User already exists"));
    }
    const newUser = await User.create({
      email: googleUser.email,
      name: googleUser.name,
      isOrg: req.body.role === "ORGANIZATION" ? true : false,
    });

    // const user = await findAndUpdateUser(
    //   {
    //     email: googleUser.email,
    //   },
    //   {
    //     email: googleUser.email,
    //     name: googleUser.name,
    //     isOrg: req.body.role === "ORGANIZATION" ? true : false,
    //   },
    //   {
    //     upsert: true,
    //     new: true,
    //   }
    // );
    CreateAndSendToken(newUser, 200, res);

    res.status(200).json({
      status: "success",
      user: newUser,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
export { googleOauthHandler };
