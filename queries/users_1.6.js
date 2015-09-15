/** 
 * 1.6 Check that users don’t reference themselves in the  «Users I want to work with» field
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('******************************************************************************************');
print('1.6 Check that users don’t reference themselves in the  «Users I want to work with» field');
print('******************************************************************************************');

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
			$project : {
           		myself: {$cmp: ['$_id', '$usersToWorkWith'] }
        	}
		},
		{
			$match : {
				myself : 0  // if previous $cmp comparison was equal
			}
		},
		{
			$project : {
				_id : 1
			}
		}
	]);

// Print on console resulting best employee
if (cursor.hasNext()) {
	var wantToWorkWithMySelf = cursor.next();
	printjson(wantToWorkWithMySelf);
	var user = db.users.find( { "_id" : wantToWorkWithMySelf._id } ).next();
	print('Found that employee "' + user.firstName+ ' ' + user.lastName + '" has a self reference.');
	printjson(user);
}
else {
	print('No employee self reference him/her.');
}


