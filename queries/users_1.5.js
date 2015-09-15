/** 
 * 1.5 Determine the best employee on the basis of the «Users I want to work with» field
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*************************************************************************************');
print('1.5 Determine the best employee on the basis of the «Users I want to work with» field');
print('*************************************************************************************');

db.users.createIndex({
    firstName: 1,
    lastName: 1
});

/* 
Query: 
	Get a new document collection from usersToWorkWith array, group them and sum appereances.  Then sort be name
	Creates a new field "birthDay" using Date operator "$dayOfMonth" to extract day number from dayOfBirth field. 
	These new fields are part of a projection including other user doc fields.  Then the result is filtered by tomorrow day and month. 
*/
var cursor = db.users.aggregate([
		{ 
			$unwind : "$usersToWorkWith" 
		},
		{
			$group : {
           		_id: '$usersToWorkWith',
           		count: { $sum: 1 }
        	}
		},
		{
			$sort : {
				count : -1
			}
		},
		{
			$limit : 1
		}
	]);

// Print on console resulting best employee
if (cursor.hasNext()) {
	var bestEmployee = cursor.next();
	printjson(bestEmployee);
	var user = db.users.find( { "_id" : bestEmployee._id } ).next();
	print('Found that employee "' + user.firstName+ ' ' + user.lastName + '" was picked ' + bestEmployee.count + ' times as user to work with.');
}
else {
	print('No results found.');

}

