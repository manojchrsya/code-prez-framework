# Code Prez Framework
Step 1: install Redis in system to store the session data.
Step 2: initialise knex (to create and run knex migrations)
	-	npm install knex -g
	-	knex init
	-	knex migrate:make 'migration name'
	-	knex migrate:latest
	-	knex seed:run

