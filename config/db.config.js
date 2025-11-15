const mongoose = require("mongoose")
// Recommended mongoose config for performance + stability
const mongooseOptions = {
    autoIndex: true,            // Build indexes automatically
    maxPoolSize: 10,            // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,     // Close sockets after 45 seconds
    family: 4,                  // Use IPv4, avoids DNS issues
    retryWrites: true,
    w: "majority",
    readPreference: "primaryPreferred",
};
const URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/dynamic_form_builder_app_db"

const connnectDb = async () => {
    try {
        mongoose.connect(URL, mongooseOptions)
        console.log("data base connected successfully")
    } catch (error) {
        console.log("database connection failed")
        process.exit(1); // Stop app if DB fails
    }
}
// Handle MongoDB events (TOP-NOTCH)
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to Database");
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection lost");
});

// Graceful shutdown
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🛑 Mongoose connection closed on app termination");
    process.exit(0);
});

module.exports = connnectDb