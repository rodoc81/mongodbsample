/** 
 * 4.3 Determine the month (with the year), in which the most time was spent
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('***************************************************************************');
print('4.3 Determine the month (with the year), in which the most time was spent');
print('***************************************************************************');

var cursor = db.timerecords.aggregate( [ 
    {
    	$group : {
    		_id: '$user',
    		spent : { $sum : '$timeSpent' }
    	}
    },
    {
    	$sort : {
    		spent : -1
    	}
    },
    {
    	$limit : 1
    }
]);


// Print on console resulting user
if (cursor.hasNext()) {
	var result = cursor.next();
	var user = db.users.find( { "_id" : result._id } ).next();
	print('Found that user ' + user.firstName + ' ' + user.lastName + ' spent ' + result.spent + ' hours on projects.');
}
else {
	print('No results found.');
}