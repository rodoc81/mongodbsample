/** 
 * 1.3 Get the list of users who celebrates their birthday tomorrow
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('********************************************************************');
print('1.3 Get the list of users who celebrates their birthday tomorrow');
print('********************************************************************');

// Tommorrow day and month 
var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // today + 1 day
var month = tomorrow.getUTCMonth() + 1;
var day = tomorrow.getUTCDate();
/* 
Query: 
	Creates a new field "birthMonth" using Date operator "$month" to extract month number from dayOfBirth field.
	Creates a new field "birthDay" using Date operator "$dayOfMonth" to extract day number from dayOfBirth field. 
	These new fields are part of a projection including other user doc fields.  Then the result is filtered by tomorrow day and month. 
*/
var cursor = db.users.aggregate([
	{
	    $project: {
		    firstName: 1,
		    lastName: 1,
		    email: 1,
		    dayOfBirth:  1,
		    position:  1,
		    department:  1,
		    login:  1,
		    birthMonth: { $month: '$dayOfBirth' },
		    birthDay: { $dayOfMonth: '$dayOfBirth'}
	    }
	}, 
	{
	    $match: {
	        birthMonth: { $eq: month },
	        birthDay: { $eq: day }
	    }
	}
]);


// while( cursor.hasNext()) {
// 	printjson(cursor.next());
// }

print('Found the amount of ' + cursor.itcount() + ' users.');

