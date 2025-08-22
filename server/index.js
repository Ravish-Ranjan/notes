const express = require("express");
const connectDb = require("./connection");
const userRouter = require("./routers/user");
const noteRouter = require("./routers/notes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(
	helmet({
		hidePoweredBy: true,
		noSniff: true,
		xssFilter: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/notes", noteRouter);
app.use(cors({ origin: "*" }));

if (process.env.NODE_ENV == "production"){

    app.use(express.static(path.join(__dirname, "../client/build")));
    
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
}

connectDb(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database Connected");
        app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
            console.log(
                `server running at http://localhost:${process.env.PORT}/`
            );
        });
    })
    .catch((err) => {
        throw err;
    });
