/** 
 * 2.1 Get a list of open projects
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('*********************************');
print('2.1 Get a list of open projects');
print('*********************************');

// Creates index for status field
db.projects.createIndex({ 
     "status": 1 
});

// Search projects matching status equal to Open
cursor = db.projects.find({ 
    "status": "Open"
});

// pretty print results
// while(cursor.hasNext()){
// 	printjson( cursor.next());
// }

print('Found the amount of ' + cursor.size() + ' "Open" projects.');
