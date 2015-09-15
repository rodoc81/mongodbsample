/** 
 * 2.2 Calculate the total budget of completed projects
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*****************************************************');
print('2.2 Calculate the total budget of completed projects');
print('*****************************************************');

// Creates index for status field
db.projects.createIndex({ 
     "status": 1 
});

// Search projects matching status equal to Closed and sum all budgets
var cursor = db.projects.aggregate( [ 
    { 
    	$match : { status : 'Closed' } 
    },
    {
    	$group : {
           		_id : '$status',
           		total : { $sum: '$budget' }
        }
    }
]);


// Print on console resulting total budget
if (cursor.hasNext()) {
	var totalBudget = cursor.next();
	print('Total budget is : ' + totalBudget.total);
}
else {
	print('No results found.');
}
