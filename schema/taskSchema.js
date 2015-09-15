var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var taskStatuses = ['Closed', 'Open', 'Reopened', 'In Progress', 'Completed'];

var taskSchema = new Schema({
    name:String,
    owner: Schema.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    status: String,
    project: Schema.Types.ObjectId,
    description: String
});

exports.taskSchema = taskSchema;
exports.taskStatuses = taskStatuses;