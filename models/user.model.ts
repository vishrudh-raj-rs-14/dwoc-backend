import mongoose, { model } from "mongoose";

const assignedOrgsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  repoLink: {
    type: String,
  },
  issueLink: {
    type: String,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  issueId: {
    type: Number,
  },
  scored: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  githubHandle: {
    type: String,
    validate: {
      validator: function (v: string) {
        return !v.includes(" ");
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid GitHub handle! It should not contain any spaces.`,
    },
  },
  isOrg: {
    type: Boolean,
    default: false,
  },
  isFilled: {
    type: Boolean,
    default: false,
  },
  college: {
    type: String,
  },
  phone: {
    type: Number,
    validate: {
      validator: function (v: string) {
        // Use a regular expression to check if the phone number is exactly 10 digits
        return /^\d{10}$/.test(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid 10-digit phone number!`,
    },
  },
  address: {
    type: String,
  },
  tshirtSize: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  assignedOrgs: {
    type: [assignedOrgsSchema],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
