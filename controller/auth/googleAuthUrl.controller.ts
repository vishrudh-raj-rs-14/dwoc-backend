import User from "../../models/user.model";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./../.env" });
const axios = require("axios");
const qs = require("qs");

const getGoogleOauthURL = (req: any, res: any, next: any) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options: any = {
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
    client_id: process.env.CLIENT_ID_GOOGLE_OAUTH,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  // res.redirect(`${rootUrl}?${qs.toString()}`);
  res.status(200).json({
    status: "success",
    url: `${rootUrl}?${qs.toString()}`,
  });
};

export { getGoogleOauthURL };
