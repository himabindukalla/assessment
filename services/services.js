const jwt = require("jsonwebtoken");
const users = require('../data/data.json');
const { saltHashPassword } = require('../utilities/encrypt');
const config = require('../config/config');
const fs = require('fs');


module.exports.createUser = (options) => {
    //TODO: Create user 
    // Return promise
    return new Promise(async (resolve, reject) => {
        // Error handler
        try {
            let { firstName, lastName, emailId, mobileNumber, address, password } = options.userDetails;
            // validate the inputs for registration
            if (!(firstName && lastName && emailId && mobileNumber && password)) {
                resolve.status(400).send("All inputs are required");
            }
            console.log("users", users)
            let temp = users.find(user => user.emailId === emailId)
            if (temp) {
                return reject({ status: 401, response: "auth/email-already-in-use" });
            }
            else if (options.userDetails !== undefined) {
                let encryptedPassword = saltHashPassword(password);
                let currentUser = options.userDetails;
                currentUser.password = encryptedPassword;
                let token = jwt.sign(currentUser, config.secretKey, { expiresIn: "2h" });
                currentUser.token = token;
                console.log('current user with token', currentUser)
                users.push(currentUser);
                fs.writeFile("../data/data.json", JSON.stringify(users, null, 2), err => {

                    // Checking for errors
                    if (err) throw err;

                    console.log("updated json file"); // Success
                });
                console.log('updated users', users)
                resolve({ status: 200, message: "User successfully created", response: { firstName, lastName, emailId, mobileNumber, address } });
            }
        } catch (err) {
            reject({ status: 500, response: `Internal server error ${err.message}` });
        }
    });
};

module.exports.userLogin = (options) => {
    //TODO: user login
    // Return promise
    return new Promise(async (resolve, reject) => {
        // Error handler
        try {
            // Get user input
            const { emailId, password } = options.loginCredentials;
            console.log('options', options);

            // Validate user input
            if (!(emailId && password)) {
                resolve({ status: 400, message: "All inputs are required" });
            }
            // Validate if user exists or not
            var index = users.findIndex((obj) => {
                return obj.emailId === emailId
            });

            console.log('index', index);
            const user = users[index];
            if (index === -1) {
                reject({ status: 400, message: "Invalid credentials" });
            }
            else if (index !== -1) {
                let tempEncrypt = saltHashPassword(password);
                let tempExistingPassword = saltHashPassword(user.password);
                if ((tempEncrypt === tempExistingPassword)) {
                    // Create token
                    const token = jwt.sign(user, config.secretKey, { expiresIn: "2h", });
                    user.token = token;
                    users[index] = user;
                    fs.writeFile("../data/data.json", JSON.stringify(users, null, 2), err => {

                        // Checking for errors
                        if (err) throw err;

                        console.log("updated json file"); // Success
                    });
                    resolve({ status: 200, message: "User successfully created", response: { user } });
                }
            }
        }
        catch (err) {
            reject({ status: 500, response: `Internal server error ${err.message}` });
        }
    })

}

module.exports.getAllUsers = (options) => {
    //TODO: Get All Users
    // Return promise
    return new Promise(async (resolve, reject) => {
        // Error handler
        try {
            const pageCount = Math.ceil(users.length / 10);
            let page = parseInt(options.p);
            if (!page) { page = 1; }
            if (page > pageCount) {
                page = pageCount
            }
            // Get user input
            const emailId = options.emailId;
            console.log('options', options);

            // Validate user input
            if (!(emailId)) {
                reject({ status: 400, message: "No user data available" });
            }

            // Validate if user exists or not
            var index = users.findIndex((obj) => {
                return obj.emailId === emailId
            });

            const user = users[index];
            if (index !== -1) {
                // Create token
                const token = jwt.sign(user, config.secretKey, { expiresIn: "2h", });
                user.token = token;
                users[index] = user;
                resolve({
                    status: 200, message: "Successfully retrieved the users list", response: {
                        users,
                        "page": page,
                        "pageCount": pageCount,
                        "usersPerPage": usersPerPage.slice(page * 2 - 2, page * 2)
                    }
                });
            }
            reject({ status: 400, message: "Invalid credentials" });
        }
        catch (err) {
            reject({ status: 500, response: `Internal server error ${err.message}` });
        }
    })
}

module.exports.updateUser = (options) => {
    //TODO: Update user details
    // Return promise
    return new Promise(async (resolve, reject) => {
        // Error handler
        try {
            // Get user input
            let userData = options.userData;
            const emailId = userData ? userData.emailId : '';
            console.log('options', options);

            // Validate user input
            if (!(emailId)) {
                reject({ status: 400, message: "No user data available" });
            }

            // Validate if user exists or not
            var index = users.findIndex((obj) => {
                return obj.emailId === emailId
            });

            const user = userData;
            user.emailId = emailId;
            if (index !== -1) {
                // Create token
                const token = jwt.sign(user, config.secretKey, { expiresIn: "2h", });
                user.token = token;
                users[index] = user;
                fs.writeFile("../data/data.json", JSON.stringify(users, null, 2), err => {

                    // Checking for errors
                    if (err) throw err;

                    console.log("updated json file"); // Success
                });
                resolve({ status: 200, message: "Successfully retrieved the users list", response: { user } });
            }
            reject({ status: 400, message: "Invalid credentials" });
        }
        catch (err) {
            reject({ status: 500, response: `Internal server error ${err.message}` });
        }
    })
}

module.exports.getUserDetails = (options) => {
    //TODO: Get user details
    // Return promise
    return new Promise(async (resolve, reject) => {
        // Error handler
        try {
            // Get user input
            const pageCount = Math.ceil(users.length / 10);
            let page = parseInt(options.p);
            if (!page) { page = 1; }
            if (page > pageCount) {
                page = pageCount
            }
            const { firstName, lastName, emailId, mobileNumber } = options;
            console.log('options', options);
            if (firstName || lastName || emailId || mobileNumber) {
                if (firstName) {
                    results = users.filter(r => r.firstName === firstName);
                }

                else if (lastName) {
                    results = users.filter(r => r.lastName === lastName);
                }

                else if (emailId) {
                    results = users.filter(r => r.emailId === emailId);
                }
                else if (mobileNumber) {
                    results = users.filter(r => r.mobileNumber === mobileNumber);

                }
                let usersPerPage = users;
                resolve({
                    status: 200, message: "Successfully retrieved the users list", response: {
                        results,
                        "page": page,
                        "pageCount": pageCount,
                        "usersPerPage": usersPerPage.slice(page * 2 - 2, page * 2)
                    }
                });
            }
            else
                reject({ status: 400, message: "Requires even one detail related to the user" });
        }
        catch (err) {
            reject({ status: 500, response: `Internal server error ${err.message}` });
        }
    })
}