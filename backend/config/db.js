import mongoose from "mongoose";

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    dbName: 'akshara-database',
  });
    console.log("Connected Successfully to MongoDB Atlas");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;