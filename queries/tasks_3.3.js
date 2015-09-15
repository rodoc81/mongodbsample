/** 
 * 3.3 Select all of the tasks where the description contains the word «deadline». It’s better to write two queries: one with the text index, and the other one with a regular expression
 */

var dbname = 'mongoktapp';
conn = new Mongo();
db = conn.getDB(dbname);
print('Connected to localhost instance and database: ' + dbname);

print('***************************************************************************************************************************************************************************************');
print('3.3 Select all of the tasks where the description contains the word «deadline». It’s better to write two queries: one with the text index, and the other one with a regular expression');
print('***************************************************************************************************************************************************************************************');

// Search with Regex
var cursor = db.tasks.find({description: {$regex: /deadline/i}});

print('Found the amount of ' + cursor.size() + ' tasks with the word "deadline".');

// Index for full text search
db.tasks.createIndex({description: 'text'});

cursor = db.tasks.find({
    $text: {
        $search: 'deadline'
    }
});

print('Found the amount of ' + cursor.size() + ' tasks with the word "deadline".');