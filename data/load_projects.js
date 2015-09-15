/*
Loads configuration.json 'projectsMaxCount' projects into MongoDB

Uses a mongoose random data generator package
*/

var log4js = require('log4js');
var _ = require('lodash');
var config = require('../config/configuration.json');
var mongoose = require('mongoose');
var fakeFactory = require('mongoose-fakery');
var userModelSchemas = require('./../schema/userSchema.js');
var projectModelSchemas = require('./../schema/projectSchema.js');


/*
Logger configuration and Mongo Connection
*/
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'log/load_projects.log', category: 'logFile', level: "INFO" }
  ]
});
var logger = log4js.getLogger('logFile');
mongoose.connect(config.mongoDbConnection);


/*
Fake generators for phoneSchema and userSchema
*/
var Project = mongoose.model('Project', projectModelSchemas.projectSchema);

var User = mongoose.model('User', userModelSchemas.userSchema);

//var pmIds = [];
var query = User.find( { 'position' : 'PM' } ).select( { _id : 1} ).exec(function (err, ids) {

    var pmIds = ids;

    fakeFactory.fake('project', mongoose.model('Project'), {
        "name" : function() {
            return (fakeFactory.g.surname()() + fakeFactory.g.str(5,20)())
        },
        "projectManager" : fakeFactory.g.pick(pmIds),
        "startDate" : function() {
            var year = fakeFactory.g.rndint(2014,2015);
            var month = fakeFactory.g.rndint(0,11);
            var day = fakeFactory.g.rndint(1,28); // till 28 to avoid issues with February
            return (new Date(year(), month(), day()));
        },
        "endDate" : function() {
            var year = fakeFactory.g.rndint(2016,2017);
            var month = fakeFactory.g.rndint(0,11);
            var day = fakeFactory.g.rndint(1,28); // till 28 to avoid issues with February
            return (new Date(year(), month(), day()));
        },
        "status" : fakeFactory.g.pick(projectModelSchemas.projectStatuses),
        "budget" : fakeFactory.g.rndint(20000, 1000000),
        "teamMembers" : []
    });

    /*
    Finished fake generators for projectSchema
    */

    /*
    *****************************************************
    Creating project instances
    */

    User.find( { 'position' : { $ne: 'PM' } } ).select( { _id : 1} ).exec(function (err, memberIds) {

        var members = _.pluck(memberIds, '_id');

        logger.info('Found %d potential members',  members.length);

        var projects = [];

        for (var i = 0; i < config.projectsMaxCount; i++) {
            projects.push(fakeFactory.make('project'));
        };

        _.forEach(projects, function (project) {
            var maxMembers = fakeFactory.g.rndint(3,8)(); // have between 3 and 8 team members
            for (var i = 0; i < maxMembers; i++) {
                project.teamMembers.push(getRandomUserId());
            }
        });

        function getRandomUserId () {
            return fakeFactory.g.pick(members)();
        };


        logger.info('Created %d projects',  projects.length);

        /*
        Finished creating phones and users
        *****************************************************
        */

        _.forEach(projects, function(p){
            logger.info('Project: %s',  p.name);
        });


        /*
        *****************************************************
        Loading Users to MongoDB
        */

        _.forEach(projects, function (project) {
            var p = new Project(project);
            p.save(function (err) {
            if (err) 
                logger.error('Error: %s', err);
            });
        });


        logger.info('Stored all entities in MongoDB');

    });

});