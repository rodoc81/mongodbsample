/** 
 * 1.4 Get the list of users whose first name is «Arnold» and last name starts with «Z» 
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*************************************************************************************');
print('1.4 Get the list of users whose first name is «Arnold» and last name starts with «Z»');
print('*************************************************************************************');

db.users.createIndex({
    firstName: 1,
    lastName: 1
});

/* 
Query: 
	Filters by firstname equal to XXXXXX and lastname matches a regex. 
*/
var cursor = db.users.find(
	{
	    "firstName": 'Arnold',
	    "lastName": { $regex: /^Z/ }
	}
);


// while( cursor.hasNext()) {
// 	printjson(cursor.next());
// }

print('Found the amount of ' + cursor.size() + ' users.');

