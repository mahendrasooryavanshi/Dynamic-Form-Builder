'use strict'
require('dotenv').config()
const express = require("express");
const morgan = require("morgan")
const helmet = require("helmet")
const cors = require("cors");
const path = require("path")
const fs = require("fs")
const app = express()
const PORT = process.env.PORT || 8000
const connnectDb = require("./config/db.config")

app.disable('x-powered-by');

app.use(helmet())  //secqure headers

app.use(cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); //colored logs

// Serve /public folder
app.use(express.static(path.join(__dirname, "public")));

// Serve only excel folder with URL: /excel/filename.xlsx
app.use("/excel", express.static(path.join(__dirname, "public/excel")));

app.get("/health", async (req, res) => {
    console.log(" check helth route")
    return res.send({ message: "server is working fine" })
})

app.use("/users", require("./route/user.route"));
app.use("/admin", require("./route/admin.route"));

app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

//Global Error Handler
app.use((err, req, res, next) => {
    const errorBody = {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        body: req.body,
    }

    console.error("SERVER ERROR:", errorBody);

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});


app.listen(PORT, (err) => {
    if (err) {
        console.log("Error in while starting tht app")
    }
    console.log(`Server is listing: http://localhost:${PORT}`)
    connnectDb()
})