/** 
 * 3.2 Select all current (status "in process") tasks for a project (using a compound index)
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*******************************************************************************************');
print('3.2 Select all current (status "in process") tasks for a project (using a compound index)');
print('******************************************************************************************');

// Creates index for status and project ID fields
db.tasks.createIndex({
	project: 1,
	status: 1
});

// Finds tasks in progress for a given project ID
var cursor = db.tasks.find({
	status: 'In Progress',
	project: ObjectId("55e9ccdfaf430b081113dd39")
});


print('Found the amount of ' + cursor.size() + ' "In Progress" tasks for project ID: 55e9ccdfaf430b081113dd39');