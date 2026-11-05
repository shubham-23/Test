function registerUser(name, email) {

    if (!name || !email) {
        return "All fields are required";
    }

    return "Registration successful";

}

module.exports = registerUser;