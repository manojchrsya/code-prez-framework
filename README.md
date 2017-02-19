# Code Prez Framework


# Step 1:

Install Nodemon and Redis.

# Step 2:

Update development.json file with required attributes like DB_USER, DB_PASSWORD, DB_NAME.
  
# Step 3:

Install required NPM packages and Initialise knex (to create and run knex migrations) and run below commands.

```sh
	$ npm install
    $ npm install knex -g
    $ knex init
   
```
# Step 4:

Update knexfile.js file with required details for **Mysql** please see below code.

```json
{
	development: {
	    client: 'mysql',
	    connection: {
	        database: 'DB_NAME',
	        user:     'DB_USER',
	        password: 'DB_PASSWORD'
	    },
	    pool: {
	        min: 2,
	        max: 10
	    },
	    migrations: {
	        tableName: 'knex_migrations'
	    }
	}    
}
```

# Step 5:

```sh
	$ knex migrate:latest
    $ knex seed:run
    $ npm install
    $ npm start
```
# Dependencies
	    - Nodemon
    	- Redis

# License
---
MIT