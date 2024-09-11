const bcrypt = require("bcrypt");

async function hashString(input) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(input, salt);
    return hash;
}

async function compareHashes(input, storedHash) {
    return await bcrypt.compare(input, storedHash);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = {
    hashString,
    compareHashes,
    isValidEmail
};
