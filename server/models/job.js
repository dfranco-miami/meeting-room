// ./models/job.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema({
    ownerUserId: String,
    clientName: String,
    service: String,
    dateTimeDue: Date,
    hours: Number,
    phone: String,
    email: String
});

module.exports = mongoose.model('Job', JobSchema);