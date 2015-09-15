/**
 * 4.2 Calculate the average time per task in all projects
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*********************************************************');
print('4.2 Calculate the average time per task in all projects');
print('*********************************************************');

db.timerecords.createIndex({ 
     "project": 1,
     "task": 1
});

// OLD QUERY
// var cursor = db.timerecords.aggregate( [ 
//     {
//     	$group : {
//     		_id: null,
//     		avgTime : { $avg : '$timeSpent' }
//     	}
//     }
// ]);

// NEW QUERY
var cursor = db.timerecords.aggregate(
  [
    {
    	$group: 
    	{
      		_id : { project : '$project', task : '$task' }, 
      		avgTimePerTask: { $avg: '$timeSpent' }
    	}
	},
	{
    	$group:
      	{
        	_id: null,
        	OverallAvgTime: { $avg: "$avgTimePerTask" }
      	}
  	}
  ],
  {
    allowDiskUse: true
  }
);

if (cursor.hasNext()) {
	var result = cursor.next();
	print('Found the amount of "' + Math.round(result.OverallAvgTime, 2) + '" average hours spent per task in all projects.');
}
else {
	print('No results found.');
}