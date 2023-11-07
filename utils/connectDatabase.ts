import mongoose from "mongoose";

const connectDatabase = async (database: string, uri?: string) => {
  try {
    if (!uri) uri = process.env.MONGODB_URI;
    console.log(uri);

    await mongoose.connect(uri + database);
    console.log("Connection with database successful");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDatabase;
