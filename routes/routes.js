const express = require('express');
const userServices = require('../services/services')
const router = new express.Router({ mergeParams: true });
const { isAuthenticated } = require('../middleware/auth');

router.get('', (req, res) => {
    res.status(200).json({ code: 200, message: 'Home of API reached' })
});

router.post('/api/register', (req, res) => {
    let options = {
        userDetails: req.body, //Pass the userDetails as a request body to the services
    }
    console.log("options", options);
    userServices.createUser(options).then(details => {
        res.status(details.status || 200).json(details.response)
    })
        .catch(err => {
            return res.status(err.status).send({
                status: err.status,
                error: err.response,
                options: options
            });
        });
});

router.put('/api/updateUser', (req, res) => {
    let options = {
        userData: req.body
    }
    // console.log("options", options);
    userServices.updateUser(options).then(details => {
        res.status(details.status || 200).json(details.response)
    })
        .catch(err => {
            return res.status(err.status).send({
                status: err.status,
                error: err.response
            });
        });
});

router.get('/api/allUsers', isAuthenticated, (req, res) => {
    let options = {
        emailId: req.query.email_id, //Pass the emailId as a request param to the services
        p: req.query.p
    }
    console.log("options", options);
    userServices.getAllUsers(options).then(details => {
        res.status(details.status || 200).json(details.response)
    })
        .catch(err => {
            return res.status(err.status).send({
                status: err.status,
                error: err.response
            });
        });
});

router.post('/api/userLogin', (req, res) => {
    let options = {
        loginCredentials: req.body //Pass the login credentials
    }
    // console.log("options", options);
    userServices.userLogin(options).then(details => {
        res.status(details.status || 200).json(details.response)
    })
        .catch(err => {
            return res.status(err.status).send({
                status: err.status,
                error: err.response
            });
        });
});

router.get('/api/users', isAuthenticated, (req, res) => {
    let options = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        emailId: req.query.emailId,
        mobileNumber: req.query.mobileNumber,
        p: req.query.p
    }
    console.log("options", options);
    userServices.getUserDetails(options).then(details => {
        res.status(details.status || 200).json(details.response)
    })
        .catch(err => {
            return res.status(err.status).send({
                status: err.status,
                error: err.response
            });
        });
});

module.exports = router;