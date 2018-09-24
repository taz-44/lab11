# LAB 11

## Requirements

### Your application should meet the following requirements:

* Shows a list of contacts (at least 10 initially)
* provide a db script to create the collection or table, and script to insert those 10 documents or records
* Can add a new contact
* Can edit an existing contact
* Can delete a contact
* Can sort contacts alphabetically
* Ascending order
* Descending order
* Can search for contacts
* Contacts are stored in database (either MongoDB or PostgreSQL)
* _Your project will be rejected if a node_modules folder is included in the submission_

Each of the requirements should make a call to your running NodeJS server.  For example, when adding a contact, your front end should make a POST request to add the new contact.  The search functionality should send a GET request with your search term to your NodeJS server to get a list of relevant contacts.

Styling is completely up to you, but make it clean and readable.

Data should all be stored in a database.  You are welcome to use either PostgreSQL, or Mongodb, but you must access the data from your database.  Anytime you get contacts, your server-side code should run a query on your database to get the contacts requested.  The data should persist in the database between start/stop cycles of the server, database, and frontend.

