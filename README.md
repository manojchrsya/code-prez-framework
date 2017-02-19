# Code Prez Framework


# Step 1:
  - Install Redis in system to store the session data.
  
# Step 2:
  - Initialise knex (to create and run knex migrations) and run below commands.
```sh
    $ npm install knex -g
    $ knex init
    $ knex migrate:latest
    $ knex seed:run
```
# Step 3:
```sh
    $ npm install
    $ npm start
```

# License
---
MIT