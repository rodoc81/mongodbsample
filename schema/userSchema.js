var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var phoneSchema = new Schema({
    type: String,
    number: String
});

var phoneTypes = ['Home', 'Work', 'Cell Phone'];

var userSchema = new Schema({
    firstName:String,
    lastName:String,
    email:String,
    dayOfBirth: Date,
    position: String,
    department: String,
    status: String,
    photoUrl: String,
    login: String,
    phones: [Schema.Types.ObjectId],
    usersToWorkWith: [Schema.Types.ObjectId]
});

var positions = ['Developer', 'UX Designer', 'Team Lead', 'QA', 'PM', 'Senior Developer', 'Senior QA'];
var departments = ['Production', 'HR', 'Accountant'];
var statuses = ['Working', 'Fired'];

exports.phoneSchema = phoneSchema;
exports.phoneTypes = phoneTypes;
exports.userSchema = userSchema;
exports.positions = positions;
exports.departments = departments;
exports.statuses = statuses;