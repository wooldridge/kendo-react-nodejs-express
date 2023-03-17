# KendoReact Data Grid With MarkLogic

This is a sample application that uses the KendoReact Data Grid with an Express server. The Grid has server data operations and CRUD operations.

This version has been updated to run on [MarkLogic](http://www.marklogic.com).

## Running the Application

Please execute the following steps to run the application:

1. Go to the `setup` folder.

````
cd setup
````

2. Install the packages for the setting up MarkLogic.

````
npm install
````

3. If needed, edit `setup/config.js` for your MarkLogic server.

4. With MarkLogic running, set up MarkLogic.

````
node setup.js
````

5. Go to the `server` folder.

````
cd ../server
````

6. Install the packages for the server.

````
npm install
````

7. Start the server.

````
node index.js
````
8. Open a new terminal at the project root and go to the client folder.

````
cd client
````

9. Install the packages for the client application.

````
npm install
````

10. Run the client application.

````
npm start
````

