
Structure of directory:

- config: JSON file with basic configuration used for data generators
- data: Data script generators
- log: data generators log files
- queries: mongo shell queries
- schema: Mongoose schemas used on script generators

*****************************************************************************************************************
*****************************************************************************************************************

Pre requisites to run Generators and Scripts:

1. Need a MongoDB instance installed and running locally (can configure connection on config/configuration.json)
2. Need Node.js and NPM installed and configured
3. Run npm install from root path

*****************************************************************************************************************
*****************************************************************************************************************

Steps to Run Data Generators:

There is a script to generate data for each collection.  It is required to follow given order:

1. Run: "npm run loadusers"
2. Run: "npm run loadprojects"
3. Run: "npm run loadtasks"
4. Run: "npm run loadtimerecords"

*****************************************************************************************************************
*****************************************************************************************************************

Steps to Run Queries:

There is a script for each of the questions.  These are mongo shell scripts so "mongo" command must be available.

1. Go to queries directory
2. Run: "mongo users_1.x.js" (there is one file per each question, so change "x" accordingly)
3. Run: "mongo projects_2.x.js"
4. Run: "mongo tasks_3.x.js"
5. Run: "mongo timerecord_4.x.js"
