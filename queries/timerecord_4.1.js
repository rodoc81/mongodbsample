/** 
 * 4.1 Calculate the total time spent on a specific project
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*********************************************************');
print('4.1 Calculate the total time spent on a specific project');
print('*********************************************************');

// Creates index for status field
db.timerecords.createIndex({ 
     "project": 1
});


var cursor = db.timerecords.aggregate( [ 
    {
    	$match : { project : ObjectId("55e9ccdfaf430b081113dd39") }
    },
    {
    	$group : {
    		_id: '$project',
    		spent : { $sum : '$timeSpent' }
    	}
    }
]);

// Print on console resulting total budget
if (cursor.hasNext()) {
	var result = cursor.next();
	print('Found the amount of ' + result.spent + ' hours spent for given project.');
}
else {
	print('No results found.');
}