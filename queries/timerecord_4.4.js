/** 
 * 4.4 Calculate the total time spent on a specific project
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*********************************************************');
print('4.4 Calculate the total time spent on a specific project');
print('*********************************************************');

var cursor = db.timerecords.aggregate( [ 
    {
    	$group : {
    		_id: {
    			month : { $month : '$date' },
    			year : { $year : '$date' },
    		},
    		hours : { $sum : '$timeSpent' }
    	}
    },
    {
    	$sort : {
    		hours : -1
    	}
    },
    {
    	$limit : 1
    }
]);


// Print on console resulting user
if (cursor.hasNext()) {
	var result = cursor.next();
	print('Found that month: ' + result._id.month + ' of year: ' + result._id.year + ' has ' + result.hours + ' hours on projects.');
}
else {
	print('No results found.');
}