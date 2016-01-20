var JobsController = function (jobModel) {
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.jobModel = jobModel;
};

JobsController.prototype.getJobs = function (userId, page, pageSize, sortColumn, sortDir, callback) {

    var me = this;   

    var query = {
        ownerUserId: userId
        /*,
        fromDate: { '$gte': fromDate },
        toDate: { '$lt': toDate }*/
    };
    
    
    var sortOption = {};
    sortOption[sortColumn] = sortDir;
    
    me.jobModel.find(query)
        .sort(sortOption)
        .skip(pageSize * (--page)) //???
        .limit(pageSize)
        .exec(function (err, jobs) {
            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }

            return callback(err, new me.ApiResponse({success: true, extras: {jobs: jobs}}));
        });
};


JobsController.prototype.addJob = function (newJob, callback) {
    var me = this;
/*
    var query = {
        locationId: newJob.locationId,
        fromDate: { '$gte': newJob.dateTimeFrom },
        toDate: { '$lt': newJob.dateTimeTo }
    };
    
    me.jobModel.findOne(query, function (err, job) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (job) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.BOOKING_ALREADY_EXISTS } }));
        } else {

   */
    newJob.save(function (err, job, numberAffected) {
                
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (numberAffected === 1) {

            return callback(err, new me.ApiResponse({ success: true, extras: null }));
        } else {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE_JOB } }));
        }

    });
       /* }

    });*/
    
};

module.exports = JobsController;