const registerUser = require("./user");

test("Registration with valid details", () => {

    expect(
        registerUser("Shubham", "shubham@gmail.com")
    ).toBe("Registration successful");

});

test("Registration without name", () => {

    expect(
        registerUser("", "shubham@gmail.com")
    ).toBe("All fields are required");

});

test("Registration without email", () => {

    expect(
        registerUser("Shubham", "")
    ).toBe("All fields are required");

});