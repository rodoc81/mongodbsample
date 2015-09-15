/** 
 * 2.4 Identify the busiest employee based on the “List of project’s participants” field and display all of their projects.
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*************************************************************************************************************************');
print('2.4 Identify the busiest employee based on the “List of project’s participants” field and display all of their projects.');
print('*************************************************************************************************************************');

// Creates index for status field
db.projects.createIndex({ 
     "status": 1 
});

var cursor = db.projects.aggregate( [ 
    {
    	$unwind : "$teamMembers"
    },
    {
    	$group : {
    		_id : '$teamMembers',
    		project: { $push: '$_id' },
    		memberOf : { $sum : 1 }
    	}
    },
    {
    	$sort : {
    		memberOf : -1
    	}
    },
    {
    	$limit : 1
    }
]);


// Print on console busiest employee and related projects
if (cursor.hasNext()) {
	var result = cursor.next();
	var user = db.users.find( { "_id" : result._id } ).next();
	print('Busiest user is : ' + user.firstName + ' ' + user.lastName + ' with ID: ' + user._id + ' and the amount of ' + result.memberOf + ' projects.');
	var projects = db.projects.find( { 'teamMembers' : { $in : [user._id] } } );

	while (projects.hasNext()) {
		print('---- Project: ' + projects.next().name);
	}

}
else {
	print('No results found.');
}