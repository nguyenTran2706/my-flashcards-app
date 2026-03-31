import mongoose from 'mongoose';

let cached = global._mongooseConnection;

const connectDB = async () => {
    // Reuse existing connection in serverless environments
    if (cached && mongoose.connection.readyState === 1) {
        return cached;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        cached = conn;
        global._mongooseConnection = cached;
        return conn;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        // Don't call process.exit in production/serverless — it kills the function
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        throw error;
    }
};

export default connectDB;