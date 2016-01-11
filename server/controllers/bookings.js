var BookingsController = function (bookingModel) {
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.bookingModel = bookingModel;
};

BookingsController.prototype.getBookings = function (userId, fromDate, toDate, page, pageSize, sortColumn, sortDir, callback) {

    var me = this;   

    var query = {
        ownerUserId: userId
        /*,
        fromDate: { '$gte': fromDate },
        toDate: { '$lt': toDate }*/
    };
    
    
    var sortOption = {};
    sortOption[sortColumn] = sortDir;
    
    me.bookingModel.find(query)
        .sort(sortOption)
        //.skip(pageSize * page)
        //.limit(pageSize)
        .exec(function (err, bookings) {
            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }

            return callback(err, new me.ApiResponse({success: true, extras: {bookings: bookings}}));
        });
};


BookingsController.prototype.addBooking = function (newBooking, callback) {
    
    var me = this;   

    var query = {
        locationId: newBooking.locationId,
        fromDate: { '$gte': newBooking.dateTimeFrom },
        toDate: { '$lt': newBooking.dateTimeTo }
    };

    me.bookingModel.findOne(query, function (err, booking) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (booking) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.BOOKING_ALREADY_EXISTS } }));
        } else {

            newBooking.save(function (err, booking, numberAffected) {
                if (err) {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                }

                if (numberAffected === 1) {

                    return callback(err, new me.ApiResponse({ success: true, extras: null }));
                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE_BOOKING } }));
                }

            });
        }

    });
    
};

module.exports = BookingsController;