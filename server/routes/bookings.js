var express = require('express'),
    router = express.Router(),
    BookingsController = require('../controllers/bookings.js'),
    Booking = require('../models/booking.js'),
    UserSession = require('../models/user-session.js'),
    ApiResponse = require('../models/api-response.js');
    ApiMessages = require('../models/api-messages.js');

router.route('/bookings/')
    .get(function (req, res) {

        var bookingsController = new BookingsController(Booking);

        UserSession.findOne({ sessionId: req.get('X-Auth-Token') }, function (err, session) {

            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }
            
            if (session) {

                bookingsController.getBookings(
                    session.userId,
                    req.query.fromDate,
                    req.query.toDate,
                    ((req.query.page) ? parseInt(req.query.page) : 1),
                    ((req.query.pageSize) ? parseInt(req.query.pageSize) : 15),
                    ((req.query.sortColumn) ? req.query.sortColumn : 'fromDate'),
                    ((req.query.sortDir=='asc'||req.query.sortDir=='desc') ? req.query.sortDir : 'asc'),
                    function (err, apiResponse) {

                        return res.send(apiResponse);
                    });

            } else {
                return res.send(new ApiResponse({ success: false, extras: { msg: ApiMessages.EMAIL_NOT_FOUND } }));
            }
        });

    });

router.route('/bookings/add')
    
    .post(function (req, res) {

        var bookingsController = new BookingsController(Booking);

    
        UserSession.findOne({ sessionId: req.get('X-Auth-Token') }, function (err, session) {
            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }

            if (session) {
                var newBooking = new Booking({
                    ownerUserId: session.userId,
                    locationId: req.body.locationId,
                    dateTimeFrom: new Date(req.body.dateTimeFrom),
                    dateTimeTo: new Date(req.body.dateTimeTo),
                    numberOfAttendees: parseInt(req.body.numberOfAttendees)
                });
                
                bookingsController.addBooking(
                    newBooking,
                    function (err, apiResponse) {

                        return res.send(apiResponse);
                    });

            } else {
                return res.send(new ApiResponse({ success: false, extras: { msg: ApiMessages.EMAIL_NOT_FOUND } }));
            }
        });

    });

module.exports = router;