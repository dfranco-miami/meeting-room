var express = require('express'),
    router = express.Router(),
    JobsController = require('../controllers/jobs.js'),
    Job = require('../models/job.js'),
    UserSession = require('../models/user-session.js'),
    ApiResponse = require('../models/api-response.js');
    ApiMessages = require('../models/api-messages.js');

router.route('/jobs/')
    .get(function (req, res) {

        var jobsController = new JobsController(Job);

        UserSession.findOne({ sessionId: req.get('X-Auth-Token') }, function (err, session) {

            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }
            
            if (session) {

                jobsController.getJobs(
                    session.userId,
                    ((req.query.page) ? parseInt(req.query.page) : 1),
                    ((req.query.pageSize) ? parseInt(req.query.pageSize) : 15),
                    ((req.query.sortColumn) ? req.query.sortColumn : 'dueDate'),
                    ((req.query.sortDir=='asc'||req.query.sortDir=='desc') ? req.query.sortDir : 'asc'),
                    function (err, apiResponse) {

                        return res.send(apiResponse);
                    });

            } else {
                return res.send(new ApiResponse({ success: false, extras: { msg: ApiMessages.EMAIL_NOT_FOUND } }));
            }
        });

    });

router.route('/jobs/add')
    
    .post(function (req, res) {

        var jobsController = new JobsController(Job);

    
        UserSession.findOne({ sessionId: req.get('X-Auth-Token') }, function (err, session) {
            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }

            if (session) {
                var newJob = new Job({
                    ownerUserId: session.userId,
                    clientName: req.body.clientName,
                    service: req.body.service,
                    dateTimeDue: new Date(req.body.dateTimeDue),
                    hours: parseInt(req.body.hours),
                    phone: req.body.phone,
                    email: req.body.email
                });
                
                jobsController.addJob(
                    newJob,
                    function (err, apiResponse) {

                        return res.send(apiResponse);
                    });

            } else {
                return res.send(new ApiResponse({ success: false, extras: { msg: ApiMessages.EMAIL_NOT_FOUND } }));
            }
        });

    });

module.exports = router;