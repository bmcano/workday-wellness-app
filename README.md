# Workday Wellness App

Welcome to our Workday Wellness App project, sponsored by State Farm, which is our groups senior design project at the University of Iowa.
This project addresses the evolving landscape of remote work and the impact on employee wellness. 
This shift to remote work in many areas has allowed individuals more control over their work environments, yet it has also introduced challenges, such as reducing both physical activity and social interactions with co-workers. 
Our goal aims to alleviate these wellness concerns by creating an application giving positive workday habits and enhancing overall employee wellbeing.

# Getting Started

The following steps will guide you through the installation guide to start development on this project.

## React/Node.js Setup

1. Download and install `node.js`

    - [Download link](https://nodejs.org/en/download/)
    - [Installation guide](https://phoenixnap.com/kb/install-node-js-npm-on-windows)

2. After installing an issue may occur with the `npm` commands so in the terminal run the command

    - `npm install -g npm`

3. To verify that everything installed correctly run the following commands in the terminal

    - `node -v`
    - `npm -v`

4. Clone this repository

5. Open project folder in `VS Code`

6. Run the command `npm install` to get all the dependencies

7. Run the command `npm start` which will run the project on [http://localhost:3000](http://localhost:3000) to verify everything is working properly

## Server and MongoDB Setup

1. Download and intall Mongo Community Server, Mongosh, and MongoDB Compass

    - [Mongo Community Server](https://www.mongodb.com/try/download/community)
    - [Mongo Compass](https://www.mongodb.com/products/tools/compass)
    - [Mongo Shell](https://www.mongodb.com/try/download/shell)
    - [Installation Guide](https://www.youtube.com/watch?v=jvaBaxlTqU8)

2. To verify that Mongo Shell is installed run the command `mongosh` in a terminal

3. Once Mongo Shell is working, open MongoDB Compass and the URI should be `mongodb://localhost:27017/`

4. Click `Connect`

5. On the left side towards the top add a new database and fill in the fields
    - Database Name = `wellness-app`
    - Collection Name = `users`

6. Click `Create Database`

7. In `VS Code` open a terminal and in the project directory run the following commands to setup the server on `localhost:3001`:

    - `cd db`
    - `npm install`
    - `npm run start:db`

## Enviornment Variables

For local development we need two `.env` files one in the `../` (root) directory and one in the `../db` (server) directory. 
Some values are intentionally omitted due to security concerns, to get them contact Brandon.
```js
REACT_APP_SESSION_SECRET="{session_secret}"
REACT_APP_AZURE_CLIENT_ID="{client_id}"
REACT_APP_EMAIL_PASSWORD="{email_password}"
REACT_APP_SERVER_URL='http://localhost:3001'
REACT_APP_WEBSITE_URL='http://localhost:3000'
REACT_APP_MONGO_ATLAS="mongodb://localhost:27017/wellness-app"
```

**Note:** Depending on the version of `node` the `localhost:27017` connection may be problematic in which case you will have to use `127.0.0.1:27017` instead. 

For production purposes (as of time of this project) some values are modified to work with our cloud deployments.
```js
REACT_APP_SERVER_URL='https://workday-wellness-app.onrender.com'
REACT_APP_WEBSITE_URL='https://bmcano.github.io/workday-wellness-app'
REACT_APP_MONGO_ATLAS="mongodb+srv://workday-wellness-app:vOISxmnRbW0zvj4g@workday-wellness-app.jatfumk.mongodb.net/?retryWrites=true&w=majority&appName=workday-wellness-app"
```

## Seeding Setup

1. Python is utilized for seeding fake data into our database, first ensure python is installed.

2. Next go into the db directory: `cd db`

3. Install the python mongo library `pip install pymongo`

4. Install the python pillow library `pip install pillow`

5. Run the command `npm run seed` to add the fake data

## (Optional) Navigation Script

1. Python is utilized to make a visual of all of our navigations so that it's easy to see the flow of the app.

2. In the project directory: `pip install graphviz`

3. Follow instructions from [here](https://pypi.org/project/graphviz/) to set the `PATH` enviorment variables

4. A computer restart will be required

5. If any changes are made to `navigation.py` you can run the command `npm run nav` to get an updated `pdf`

## Available Scripts

The following section was generated after the `npx create-react-app <project-name>` command was executed, but has since been modified in some parts to fit this project.

### In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run seed`

Will run the python script to seed all the stub data into the MongoDB database.

### `npm run start:db`

In the project directory this will first seed the data then start the server on `port:3001`. Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

### `npm run all`

This will run everything in one command to get the server up, the seeding script, start the database server, start the front-end server, then open the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run nav`

This will create a `pdf` of the navigation graph that is manually updated for the sake of documentation.
The `pdf` can be found at `src/static/navigation/navigation.gv.pdf`.

### `npm run predeploy`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run deploy`

Builds the app for production to the `build` folder.
Then will push the build to the `gh-pages` branch and start the deployment of the front-end application

### In the `db` directory, you can run:

### `npm run seed`

Will run the python script to seed all the stub data into the MongoDB database.

### `npm run start:db`

In the `db` directory this will start the server on `port:3001`. Open [http://localhost:3001](http://localhost:3001) to view it in your browser. This will not seed the data.
