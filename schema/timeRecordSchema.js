var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var timeRecordSchema = new Schema({
    description:String,
    task: Schema.Types.ObjectId,
    date: Date,
    user: Schema.Types.ObjectId,
    project: Schema.Types.ObjectId,
    timeSpent: Number
});

exports.timeRecordSchema = timeRecordSchema;