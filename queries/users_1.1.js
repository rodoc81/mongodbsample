/** 
 * 1.1 Get the user by a domain login 
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);


print('*************************************************************');
print('1.1 Get the user by a domain login');
print('*************************************************************');

// Creates index for login param.
db.users.createIndex(
	{ 
     	"login": 1 
	},
	{
		unique: true
	}
);

// Search users matching login equal to
cursor = db.users.find({ 
    "login": "crodriguez97"
});

// pretty print results
while(cursor.hasNext()){
	printjson( cursor.next());
}

print('Found the amount of ' + cursor.size() + ' users.');
