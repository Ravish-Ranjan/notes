const express = require("express");
require("dotenv").config();
const { User, Note, connectDb } = require("./db");
const usersRouter = require("./routes/user");
const notesRouter = require("./routes/notes");

const app = express();

app.use(express.json());
app.use("/users", usersRouter);
app.use("/notes", notesRouter);

connectDb((err) => {
    if (err) throw err;
    else {
        app.listen(process.env.PORT || 3001, () => {
            console.log(
                `backend started at http://localhost:${
                    process.env.PORT || 3001
                }`
            );
        });
    }
});
