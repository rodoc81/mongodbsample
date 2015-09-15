/** 
 * 3.4 Select every open task (status «open», «in process», «reopened») by specific user sorted by start date  (using a compound index)
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('**************************************************************************************************************************************');
print('3.4 Select every open task (status «open», «in process», «reopened») by specific user sorted by start date  (using a compound index)');
print('**************************************************************************************************************************************');

// Creates index for status and owner fields
db.tasks.createIndex({
	owner: 1,
	status: 1,
	startDate: 1
});


var cursor = db.tasks.find(
	{
    	"owner" : ObjectId("55e75859899b7c6c0b64d13c"),
    	"status" : { $in : [ "In Progress", "Open", "Reopened" ] }
	}
).sort( 
	{ 
		startDate : 1 
	}
);

print('Found the amount of ' + cursor.size() + ' open tasks for given user.');