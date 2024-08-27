require("dotenv").config(); // Ensure this is at the very top
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const postRoutes = require("./src/routes/post/postRoutes");
const commentRoutes = require("./src/routes/post/commentRoutes")

const userRoutes = require("./src/routes/user/userRoutes");
const authRoutes = require("./src/routes/user/authRoutes")
const profileRoutes = require("./src/routes/user/profileRoutes")
const notificationRoutes = require("./src/routes/user/notificationRoutes")

const companyRoutes = require("./src/routes/companyRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const discussionRoutes = require("./src/routes/discussionRoutes");

const dbMiddleware = require("./src/middleware/dbMiddleware"); // Middleware for connecting to MongoDB
const errorHandler = require("./src/middleware/errorHandler"); // Custom error handler

// MongoDB
// const { MongoClient } = require("mongodb");
const config = require(`./src/config/${process.env.NODE_ENV || "development"}`);

async function connectToDB() {
    try {
        await mongoose.connect(config.dbURI);
        // const client = await new MongoClient(config.dbURI).connect();
        console.log("DB연결성공");
        // return client.db("project1");
    } catch (err) {
        console.error("DB 연결 실패:", err);
        process.exit(1); // Exit with an error code
    }
}

let db;
connectToDB().then((database) => {
    db = database;
    //mount routes after the database connection promise resolves successfully.
    app.use("/api/post", postRoutes);
    app.use("/api/comment", commentRoutes);

    app.use("/api/user", userRoutes);
    app.use("/api/auth", authRoutes)
    app.use("/api/profile", profileRoutes)
    app.use("/api/notification", notificationRoutes)

    app.use("/api/company", companyRoutes);
    app.use("/api/job", jobRoutes);
    app.use("/api/discussion", discussionRoutes);
    app.use(dbMiddleware); // Applies to all subsequent routes

    // Global Error Handler (Implement your logic here)
    app.use(errorHandler);

    app.listen(8080, () => {
        console.log("http://localhost:8080 에서 서버 실행중");
    });
});
