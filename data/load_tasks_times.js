/*
Loads configuration.json 'tasksMaxCount' tasks and 'timeAccountingRecord' into MongoDB

Uses a mongoose random data generator package
*/

var log4js = require('log4js');
var _ = require('lodash');
var async = require('async');
var config = require('../config/configuration.json');
var mongoose = require('mongoose');
var fakeFactory = require('mongoose-fakery');
var userModelSchemas = require('./../schema/userSchema.js');
var projectModelSchemas = require('./../schema/projectSchema.js');
var taskModelSchemas = require('./../schema/taskSchema.js');
var timeRecordModelSchemas = require('./../schema/timeRecordSchema.js');


/*
Logger configuration and Mongo Connection
*/
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'log/load_tasks.log', category: 'logFile', level: "INFO" }
  ]
});
var logger = log4js.getLogger('logFile');
mongoose.connect(config.mongoDbConnection);


/*
Fake generators for phoneSchema and userSchema
*/
var Project = mongoose.model('Project', projectModelSchemas.projectSchema);
var User = mongoose.model('User', userModelSchemas.userSchema);
var Task = mongoose.model('Task', taskModelSchemas.taskSchema);
var TimeRecord = mongoose.model('TimeRecord', timeRecordModelSchemas.timeRecordSchema);


User.find().select( { _id : 1} ).exec(function (err, ids) {

    var userIds = ids;

    Task.find().exec(function (err, ts) {

        var tasks = ts;

        fakeFactory.fake('timeRecord', mongoose.model('TimeRecord'), {
            "description" : fakeFactory.g.str(5,20),
            "user" : fakeFactory.g.pick(userIds),
            "date" : function() {
                var year = fakeFactory.g.rndint(2015, 2016);
                var month = fakeFactory.g.rndint(0,11);
                var day = fakeFactory.g.rndint(1,28); // till 28 to avoid issues with February
                return (new Date(year(), month(), day()));
            },
            "task" : null,
            "project" : null,
            "timeSpent" : fakeFactory.g.rndint(1,8)
        });

        var timeRecords = [];

        for (var i = 0; i < config.timeAccountingRecord; i++) {
            timeRecords.push(fakeFactory.make('timeRecord'));
        };

        _.forEach(timeRecords, function (timeRecord) {
            var singleTask = fakeFactory.g.pick(tasks)();
            timeRecord.task = (singleTask._id);
            timeRecord.project = (singleTask.project);
        });

        /*
        *****************************************************
        Loading Tasks and timeRecords to MongoDB
        */

        _.forEach(timeRecords, function (timeRecord) {
            var t = new TimeRecord(timeRecord);
            t.save(function (err) {
            if (err) 
                logger.error('Error: %s', err);
            });
        });


        logger.info('Stored all entities in MongoDB');

    });
});