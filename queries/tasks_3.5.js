/** 
 * 3.5 Select the project with the largest number of tasks
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*********************************************************');
print('3.5 Select the project with the largest number of tasks');
print('*********************************************************');

// Creates index for status field
db.tasks.createIndex({ 
     "project": 1 
});

var cursor = db.tasks.aggregate( [ 
    {
    	$group : {
    		_id: '$project',
    		amountOfTasks : { $sum : 1 }
    	}
    },
    {
    	$sort : { amountOfTasks : -1 }
    },
    {
    	$limit : 1
    }
]);

// Print on console resulting amount of tasks
if (cursor.hasNext()) {
	var result = cursor.next();
	print('Found project id: ' + result._id + ' with the total amoount of ' + result.amountOfTasks + ' tasks.');
}
else {
	print('No results found.');
}