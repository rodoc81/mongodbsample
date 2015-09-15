/** 
 * 3.1 Calculate the total number of closed taskset a list of open projects
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('**************************************************************************');
print('3.1 Calculate the total number of closed taskset a list of open projects');
print('**************************************************************************');

// Creates index for status field
db.tasks.createIndex({ 
     "status": 1 
});

// Search tasks matching status equal to Closed
var closedTasksCount = db.tasks.count( { "status": "Closed" } );

print('Found the amount of ' + closedTasksCount + ' "Closed" tasks.');