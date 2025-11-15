module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader, ">>>>>>>> heaader")
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res.status(401).send("Unauthorized");
    }

    const base64 = authHeader.split(" ")[1];
    const decoded = Buffer.from(base64, "base64").toString("ascii");
    const [user, pass] = decoded.split(":");

    if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
        return res.status(401).send("Unauthorized");
    }

    next();
};
