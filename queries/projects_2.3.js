/** 
 * 2.3 Calculate the average number of people involved in the project
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*******************************************************************');
print('2.3 Calculate the average number of people involved in the project');
print('*******************************************************************');

// Creates index for status field
db.projects.createIndex({ 
     "status": 1 
});

var cursor = db.projects.aggregate( [ 
    {
    	$group : {
           		_id : null, // do not group by any field, even _id
           		avgMembers : {
           			$avg : { $size: '$teamMembers' }	// get average of the size of teamMembers array
           		}
        }
    }
]);


// Print on console average members
if (cursor.hasNext()) {
	var average = cursor.next();
	print('Average amount of members is : ' + Math.round(average.avgMembers));
}
else {
	print('No results found.');
}