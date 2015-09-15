/** 
 * 1.2 Get the list of users who celebrates their birthday in summer 
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('********************************************************************');
print('1.2 Get the list of users who celebrates their birthday in summer');
print('********************************************************************');

// Summer time months ( Southern Hemisphere )
var summer_months = [1, 2, 3] 

/* 
Query: 
	Creates a new field "birthMonth" using Date operator "$month" to extract month number from dayOfBirth field.  
	This new field is part of a projection including other user doc fields.  Then the result is filtered by the Summer months. 
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
		    birthMonth: { $month: '$dayOfBirth' }
	    }
	}, 
	{
	    $match: {
	        birthMonth: { $in: summer_months }
	    }
	}
]);


print('Found the amount of ' + cursor.itcount() + ' users.');

