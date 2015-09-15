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


User.find().select( { _id : 1} ).exec(function (err, ids) {

    var userIds = ids;

    Project.find().select( { _id : 1} ).exec(function (err, pIds) {

        var projectIds = pIds;

        fakeFactory.fake('task', mongoose.model('Task'), {
            "name" : fakeFactory.g.str(5,20),
            "owner" : fakeFactory.g.pick(userIds),
            "startDate" : function() {
                var year = fakeFactory.g.rndint(2015);
                var month = fakeFactory.g.rndint(0,5);
                var day = fakeFactory.g.rndint(1,28); // till 28 to avoid issues with February
                return (new Date(year(), month(), day()));
            },
            "endDate" : function() {
                var year = fakeFactory.g.rndint(2016,2017);
                var month = fakeFactory.g.rndint(6,11);
                var day = fakeFactory.g.rndint(1,30);
                return (new Date(year(), month(), day()));
            },
            "status" : fakeFactory.g.pick(taskModelSchemas.taskStatuses),
            "project" : fakeFactory.g.pick(projectIds),
            "description" : fakeFactory.g.str(20,50)
        });

        /*
        Finished fake generators for taskSchema
        */

        /*
        *****************************************************
        Creating task instances
        */
        var tasks = [];

        for (var i = 0; i < config.tasksMaxCount; i++) {
            tasks.push(fakeFactory.make('task'));
        };

        logger.info('Created %d tasks',  tasks.length);

        /*
        *****************************************************
        Loading Tasks and timeRecords to MongoDB
        */

        _.forEach(tasks, function (task) {
            var p = new Task(task);
            p.save(function (err) {
            if (err) 
                logger.error('Error: %s', err);
            });
        });

        logger.info('Stored all entities in MongoDB');
    });

});