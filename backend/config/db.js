import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // We don't want to crash the process immediately in development so the frontend can still load with mocks or feedback.
    console.warn('Backend is running, but database connection failed. Please ensure MongoDB is running.');
  }
};

export default connectDB;
