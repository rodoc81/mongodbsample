/*
Loads configuration.json 'usersMaxCount' Users into MongoDB

Uses a mongoose random data generator package
*/

var log4js = require('log4js');
var _ = require('lodash');
var config = require('../config/configuration.json');
var mongoose = require('mongoose');
var fakeFactory = require('mongoose-fakery');
var modelSchemas = require('./../schema/userSchema.js');


/*
Logger configuration and Mongo Connection
*/
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'log/load_users.log', category: 'logFile', level: "INFO" }
  ]
});
var logger = log4js.getLogger('logFile');
mongoose.connect(config.mongoDbConnection);

/*
Fake generators for phoneSchema and userSchema
*/
var Phone = mongoose.model('Phone', modelSchemas.phoneSchema);

fakeFactory.fake('phone', mongoose.model('Phone'), {
	"type" : fakeFactory.g.pick(modelSchemas.phoneTypes),
	"number": function() {
		return fakeFactory.g.rndint(111111111, 9999999999)().toString();
	}
});

var User = mongoose.model('User', modelSchemas.userSchema);


fakeFactory.fake('user', mongoose.model('User'), {
    "firstName" : fakeFactory.g.name(),
    "lastName" : fakeFactory.g.surname(),
    "email" : fakeFactory.lazy(function(attrs) {
        return attrs.firstName.toLowerCase() + attrs.lastName.toLowerCase() + '@dataart.com';
    }),
    "dayOfBirth" : function(){
        var year = fakeFactory.g.rndint(1970, 1997);  // 18 years or higher
        var month = fakeFactory.g.rndint(0,11);
        var day = fakeFactory.g.rndint(1,28); // till 28 to avoid issues with February
        return new Date(year(), month(), day());
    },
    "position" : fakeFactory.g.pick(modelSchemas.positions),
    "department" : fakeFactory.g.pick(modelSchemas.departments),
    "status" : fakeFactory.g.pick(modelSchemas.statuses),
    "photoUrl" : function() {
        return 'http://localhost:3000/somepath/images/' + fakeFactory.g.hex(20)() + '.jpg'
    },
    "login" : fakeFactory.lazy(function(attrs){
        return attrs.firstName.toLowerCase().charAt(0) + attrs.lastName.toLowerCase() + fakeFactory.g.rndint(1, 99)();
    }),
    "phones": [],
    "usersToWorkWith": []
});

/*
Finished fake generators for phoneSchema and userSchema
*/

/*
*****************************************************
Creating phone and users instances
*/
var phones = [];
for (var i = 0; i < config.phoneMaxCount; i++) {
	phones.push(fakeFactory.make('phone'));
}

logger.info('Created %d phones', phones.length);

var users = [];

for (var i = 0; i < config.usersMaxCount; i++) {
    users.push(fakeFactory.make('user'));
};

_.forEach(users, function (user) {
    if (user.status === 'Working') { // only assign active employees
        user.usersToWorkWith.push(getRandomUserId(user._id));
        user.usersToWorkWith.push(getRandomUserId(user._id));
    }
    user.phones.push(getRandomPhone());
});

function getRandomUserId (currentId) {
    var user = fakeFactory.g.pick(users)();
    while (user._id === currentId || user.status === 'Fired') {  // do  not pick Fired employees
        user = fakeFactory.g.pick(users)();
    }
    return user._id;
};


function getRandomPhone () {
    var phone = fakeFactory.g.pick(phones)();
    return phone._id;
};

logger.info('Created %d users',  users.length);

/*
Finished creating phones and users
*****************************************************
*/

_.forEach(users, function(u){
    logger.info('User: %s - position: %s',  u.firstName, u.position);
});
_.forEach(phones, function(p){
    logger.info('Phone: %s - Type: %s', p.get('number'), p.get('type') );
});


/*
*****************************************************
Loading Users to MongoDB
*/

_.forEach(phones, function (phone) {
    var p = new Phone(phone);
    p.save(function (err) {
    if (err) 
        logger.error('Error: %s', err);
    });
});

_.forEach(users, function (user) {
    var u = new User(user);
    u.save(function (err) {
    if (err) 
        logger.error('Error: %s', err);
    });
});


logger.info('Stored all entities in MongoDB');

/* When all done just exit */
//process.exit(0)