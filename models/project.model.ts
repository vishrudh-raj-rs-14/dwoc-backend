import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organisation",
    required: true,
  },
  techStack: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  miniDescription: {
    type: String,
  },
  tags: {
    type: [String],
  },
  githubUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return v.startsWith("https://github.com/");
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid GitHub link! It should start with "https://github.com/".`,
    },
  },
  year: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  Mentor: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    required: true,
  },
  Mentee: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    required: true,
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
