import mongoose from "mongoose";
import config from "./config/config";
import connectDatabase from "./utils/connectDatabase";
import User from "./models/user.model";
import Organisation from "./models/organization.model";
import Project from "./models/project.model";
import dotenv from "dotenv";
dotenv.config();

connectDatabase(config.db);

const seedDB = async () => {
  await User.deleteMany({});
  await User.insertMany(seedUsers);
  await Organisation.deleteMany({});
  await Project.deleteMany({});
  await Organisation.insertMany(seedOrg);
  await Project.insertMany(seedProject);
};

seedDB().then(() => {
  mongoose.connection.close();
});

const seedUsers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    githubHandle: "john_doe",
    isOrg: false,
    isFilled: true,
    college: "Example University",
    phone: 1234567890,
    address: "123 Main Street, Cityville",
    tshirtSize: "M",
    isAdmin: true,
    score: 85,
  },
  {
    _id: "617c62fe8a2f131e4c87d9b3",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    githubHandle: "jane_smith",
    isOrg: true,
    isFilled: true,
    college: "Another University",
    phone: 9876543210,
    address: "456 Oak Street, Townsville",
    tshirtSize: "L",
    isAdmin: false,
    score: 92,
  },
  {
    _id: "617c62fe8a2f131e4c87d9af",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    githubHandle: "alice_j",
    isOrg: false,
    isFilled: true,
    college: "Sample College",
    phone: 5551234567,
    address: "789 Pine Avenue, Villagetown",
    tshirtSize: "S",
    isAdmin: false,
    score: 78,
  },
  {
    _id: "617c62fe8a2f131e4c87d9ae",
    name: "Bob Anderson",
    email: "bob.anderson@example.com",
    githubHandle: "bob_anderson",
    isOrg: false,
    isFilled: true,
    college: "Tech Institute",
    phone: 9876123456,
    address: "101 Elm Street, Tech City",
    tshirtSize: "XL",
    isAdmin: false,
    score: 88,
  },
  {
    _id: "617c62fe8a2f131e4c87d9a9",
    name: "Eva Miller",
    email: "eva.miller@example.com",
    githubHandle: "eva_m",
    isOrg: false,
    isFilled: true,
    college: "City College",
    phone: 4445556666,
    address: "333 Oak Avenue, Citytown",
    tshirtSize: "M",
    isAdmin: false,
    score: 95,
  },
  {
    _id: "617c62fe8a2f131e4c87d9a5",
    name: "Grace Lee",
    email: "grace.lee@example.com",
    githubHandle: "grace_lee",
    isOrg: true,
    isFilled: true,
    college: "Tech University",
    phone: 9998887777,
    address: "456 Birch Street, Techville",
    tshirtSize: "L",
    isAdmin: false,
    score: 80,
  },
  {
    _id: "617c62fe8a2f131e4c87d9a4",
    name: "David Johnson",
    email: "david.johnson@example.com",
    githubHandle: "david_j",
    isOrg: false,
    isFilled: true,
    college: "Science College",
    phone: 3334445555,
    address: "789 Cedar Road, Sciencetown",
    tshirtSize: "XL",
    isAdmin: false,
    score: 89,
  },
];

const seedOrg = [
  {
    _id: "617c62fe8a2f131e4c87d9a1",
    name: "Tech Innovators",
    projects: ["617c62fe8a2f131e4c87d9a1", "617c62fe8a2f131e4c87d9a2"], // Replace with valid ObjectIds for Projects
    orgOwner: "617c62fe8a2f131e4c87d9a7", // Replace with a valid ObjectId for the User
    year: new Date("2023-01-01"),
    githubUrl: "https://github.com/delta",
    description:
      "Fostering innovation in technology through collaborative projects.",
    miniDescription: "Tech community focused on innovation",
    mentors: ["617c62fe8a2f131e4c87d9a8", "617c62fe8a2f131e4c87d9a9"], // Replace with valid ObjectIds for Users
    isAccepted: "ACCEPTED",
    feedBack: "Excellent organization with great projects!",
    orgType: "PROGRAMMINGTOOLS",
  },
  {
    name: "Open Source Collective",
    projects: ["617c62fe8a2f131e4c87d9a3", "617c62fe8a2f131e4c87d9a4"], // Replace with valid ObjectIds for Projects
    orgOwner: "617c62fe8a2f131e4c87d9b0", // Replace with a valid ObjectId for the User
    year: new Date("2023-02-01"),
    githubUrl: "https://github.com/delta",
    description:
      "Promoting open-source projects and collaboration among developers.",
    miniDescription: "Supporting and promoting open-source initiatives",
    mentors: ["617c62fe8a2f131e4c87d9b1", "617c62fe8a2f131e4c87d9b2"], // Replace with valid ObjectIds for Users
    isAccepted: "PENDING",
    feedBack: "",
    orgType: "UTILITIES",
  },
  {
    _id: "617c62fe8a2f131e4c87d9b0",
    name: "WebDev Wizards",
    projects: ["617c62fe8a2f131e4c87d9a7", "617c62fe8a2f131e4c87d9a8"], // Replace with valid ObjectIds for Projects
    orgOwner: "617c62fe8a2f131e4c87d9b6", // Replace with a valid ObjectId for the User
    year: new Date("2023-04-01"),
    githubUrl: "https://github.com/OpenSourceCollective", // Same URL as Open Source Collective
    description:
      "Bringing together web developers for collaborative web projects.",
    miniDescription: "Community for web development enthusiasts",
    mentors: ["617c62fe8a2f131e4c87d9b7", "617c62fe8a2f131e4c87d9b8"], // Replace with valid ObjectIds for Users
    isAccepted: "ACCEPTED",
    feedBack: "Impressive organization with a diverse range of projects!",
    orgType: "FOODANDTRAVEL",
  },
];

const seedProject = [
  {
    name: "Project X",
    organisation: "617c62fe8a2f131e4c87d9a1", // Replace with valid ObjectId for Organisation
    techStack: ["Node.js", "React", "MongoDB"],
    description: "A cutting-edge project using the latest technologies.",
    miniDescription: "Cutting-edge tech project",
    tags: ["Tech", "Innovation"],
    githubUrl: "https://github.com/delta/dwoc-backend-23",
    year: new Date("2023-01-01"),
    Mentor: ["617c62fe8a2f131e4c87d9a2", "617c62fe8a2f131e4c87d9a3"], // Replace with valid ObjectIds for Users
    Mentee: ["617c62fe8a2f131e4c87d9a4", "617c62fe8a2f131e4c87d9a5"], // Replace with valid ObjectIds for Users
  },
  {
    name: "Awesome App",
    organisation: "617c62fe8a2f131e4c87d9a1", // Replace with valid ObjectId for Organisation
    techStack: ["React Native", "Firebase"],
    description: "Developing a fantastic mobile application.",
    miniDescription: "Mobile app development",
    tags: ["Mobile", "App"],
    githubUrl: "https://github.com/delta/dwoc-backend-23",
    year: new Date("2023-02-01"),
    Mentor: ["617c62fe8a2f131e4c87d9a7", "617c62fe8a2f131e4c87d9a8"], // Replace with valid ObjectIds for Users
    Mentee: ["617c62fe8a2f131e4c87d9aa"], // Replace with valid ObjectIds for Users
  },
  {
    name: "Data Analytics Platform",
    organisation: "617c62fe8a2f131e4c87d9b0", // Replace with valid ObjectId for Organisation
    techStack: ["Python", "Pandas", "Django", "React"],
    description:
      "Building a robust platform for data analysis and visualization.",
    miniDescription: "Data analytics platform",
    tags: ["Data", "Analytics"],
    githubUrl: "https://github.com/delta/dwoc-backend-23",
    year: new Date("2023-03-01"),
    Mentor: ["617c62fe8a2f131e4c87d9ac", "617c62fe8a2f131e4c87d9ad"], // Replace with valid ObjectIds for Users
    Mentee: ["617c62fe8a2f131e4c87d9ae", "617c62fe8a2f131e4c87d9af"], // Replace with valid ObjectIds for Users
  },
  {
    name: "E-commerce Website",
    organisation: "617c62fe8a2f131e4c87d9b0", // Replace with valid ObjectId for Organisation
    techStack: ["Node.js", "Express", "React", "MongoDB"],
    description: "Creating a modern and scalable e-commerce website.",
    miniDescription: "E-commerce website development",
    tags: ["E-commerce", "Web"],
    githubUrl: "https://github.com/delta/dwoc-backend-23",
    year: new Date("2023-04-01"),
    Mentor: ["617c62fe8a2f131e4c87d9b1", "617c62fe8a2f131e4c87d9b2"], // Replace with valid ObjectIds for Users
    Mentee: ["617c62fe8a2f131e4c87d9b3"], // Replace with valid ObjectIds for Users
  },
];
