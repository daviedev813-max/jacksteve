import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Tactical Log: Confirms connection to the Jacksteve Cluster
    console.log(`📡 CLUSTER ONLINE: ${conn.connection.host}`);

  } catch (error) {
    // Critical Failure: Immediate System Shutdown
    console.error(`❌ DATABASE OFFLINE: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
