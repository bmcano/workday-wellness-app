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

## MongoDB Setup

1. Download and intall MongoDB Compass

    - [Download link](https://www.mongodb.com/products/tools/compass)

2. Open MongoDB Compass the URI should be `mongodb://localhost:27017/`

3. Click `Connect`

4. On the left side towards the top add a new database and fill in the fields
    - Database Name = `wellness-app`
    - Collection Name = `users`

5. Click `Create Database`

6. In `VS Code` open a terminal and in the project directory run `npm run start:db` to start the server on `localhost:3001`.

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

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### `npm run seed`

Will run the python script to seed all the stub data into the MongoDB database.

### `npm run start:db`

In the project directory this will first seed the data then start the server on `port:3001`. Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

### `npm run all`

This will run everything in one command to get the server up, the seeding script, start the database server, start the front-end server, then open the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### In the `db` directory, you can run:

### `npm run seed`

Will run the python script to seed all the stub data into the MongoDB database.

### `npm run start:db`

In the `db` directory this will start the server on `port:3001`. Open [http://localhost:3001](http://localhost:3001) to view it in your browser. This will not seed the data.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
