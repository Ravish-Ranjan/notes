const mongoose = require("mongoose");
require("dotenv").config();

// connects to the database
const connectDb = async (done) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected");
        done(null);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        done(error);
    }
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
    },
    dob: {
        type: String,
    },
});

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique:true,
    },
    body: {
        type: String,
        require: true,
    },
    time: {
        type: String,
        require: true,
    },
});

const noteListSchema = new mongoose.Schema({
    author: {
        type: String,
        require: true,
        unique: true,
    },
    notes: [noteSchema],
});

const User = mongoose.model("user", userSchema);
const NoteList = mongoose.model("note", noteListSchema);

module.exports = {
    User,
    NoteList,
    connectDb,
};
