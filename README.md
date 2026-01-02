💊 Compound Research API
A specialized REST API built with Express and MongoDB Atlas for cataloging performance-enhancing compounds. It provides full CRUD functionality with built-in data validation for research integrity and physiological biomarkers.

Up & running 🏃‍➡️
Clone the repository:

git clone [your-repo-link]
Install dependencies:

npm install

Environment Setup: Create a .env file in the root directory and add your MongoDB connection string:

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0...
PORT=3000

Start the server:
npm start
The server will run on http://localhost:3000.

Project Files 📁
server.js: Main entry point and Express route definitions.

models/Compound.js: Logic for data validation and structure.

schema.json: Technical definition of the database structure.

compounds_export.json: Sample database export for review.

Sources 🗃️
Mike Derycke - Coding along: Boardgame REST API (Part 2): [YouTube Link.](https://www.youtube.com/watch?v=3Ykr6dZjXhE&list=PLGsnrfn8XzXii2J5-Jpqufypu6upxcSGx&index=25)

Used for: Implementation of Post-route logic for mongodb and express
