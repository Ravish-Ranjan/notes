const express = require("express");
const { User, NoteList } = require("../db");
const { hashString, compareHashes, isValidEmail } = require("../tools");

const router = express.Router();

// find user by username
router.get("/:username", async (req, res) => {
    try {
        const { username } = req.params;
        let user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                error: "User not found",
            });
        } else {
            return res.status(200).json({
                name: user.name,
                username: user.username,
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
});

// find usr by id
router.post("/id/", async (req, res) => {
    try {
        const { id } = req.body;
        let user = await User.findById(id);

        if (!user) {
            return res.status(400).json({
                error: "User not found",
            });
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
});

// add new user
router.post("/", async (req, res) => {
    try {
        const { name, username, password, dob, email } = req.body;
        let newuserdata = {
            name,
            username,
        };

        let data = await User.findOne({ username: username });
        if (data) {
            return res.status(400).json({
                error: "Username taken",
            });
        }

        if (email !== "" && isValidEmail(email)) newuserdata.email = email;
        else newuserdata.email = "";

        if (dob !== "") newuserdata.dob = dob;
        else newuserdata.dob = "";

        hashString(password).then(async (result) => {
            newuserdata.password = result;
            let newUser = new User(newuserdata);
            let saveduser = await newUser.save();
            let newnodelist = await NoteList({ author: saveduser._id });
            await newnodelist.save();
            return res.status(200).json(saveduser);
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// update user
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, password, email, dob } = req.body;
        let data = await User.findById(id);
        if (!data) {
            return res.status(400).json({
                error: "No such user found",
            });
        }
        if (name !== "") data.name = name;
        if (username !== "") data.username = username;
        if (email !== "" && isValidEmail(email)) data.email = email;
        if (dob !== "") data.dob = dob;

        if (password !== "") {
            let ret = await hashString(password);
            data.password = ret;
        }
        let saved = await data.save();
        return res.status(200).json(saved);
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error: error.message });
    }
});

// delete user
router.delete("/", async (req, res) => {
    try {
        const { id } = req.body;
        await User.findByIdAndDelete(id);
        await NoteList.findOneAndDelete({ author: id });
        return res.status(200).json({
            message: "deleted",
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
});

module.exports = router;
