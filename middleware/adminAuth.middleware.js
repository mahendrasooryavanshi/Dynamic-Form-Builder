module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res.status(401).send("Unauthorized");
    }
    const base64 = authHeader.split(" ")[1];
    const decoded = Buffer.from(base64, "base64").toString("ascii");
    // console.log("DECODED:", decoded);
    const [user, pass] = decoded.split(":");
    // console.log("USER:", user, "PASS:", pass);
    // console.log("ENV USER:", process.env.ADMIN_USER);
    // console.log("ENV PASS:", process.env.ADMIN_PASS);
    if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
        console.log("AUTH FAILED");
        return res.status(401).json({
            status: 401,
            success: false,
            message: "Unauthorized"
        });
    }
    console.log("AUTH SUCCESS");
    next();
};
