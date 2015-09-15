var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectStatuses = ['Closed', 'Open', 'Postponed'];

var projectSchema = new Schema({
    name:String,
    projectManager: Schema.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    status: String,
    budget: Number,
    teamMembers: [Schema.Types.ObjectId]
});

exports.projectSchema = projectSchema;
exports.projectStatuses = projectStatuses;