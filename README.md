# Compound Research API

A specialized REST API built with Express and MongoDB Atlas for cataloging performance-enhancing compounds. It provides full CRUD functionality with built-in data validation for research integrity and physiological biomarkers.

## Website

https://web2-course-project-back-end-ylzw.onrender.com

## Up and Running

### 1. Clone the repository

```bash
git clone [your-repo-link]
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0...
PORT=3000
```

### 4. Start the server

```bash
npm start
```

The server will run on `http://localhost:3000`.

## Project Files

- `index.js`: Main entry point and Express route definitions.
- `schema + database export/schema.json`: Technical definition of the database structure.
- `schema + database export/courseproject-web2.compounds.json`: Sample database export for review.

## Sources

- Mike Derycke, Coding along: Boardgame REST API (Part 2): [YouTube link](https://www.youtube.com/watch?v=3Ykr6dZjXhE&list=PLGsnrfn8XzXii2J5-Jpqufypu6upxcSGx&index=25). Used for implementation of POST route logic for MongoDB and Express.
- Europe PMC API (PubMed): [Europe PMC REST API documentation](https://europepmc.org/RestfulWebService). Used for REST proxy integration to search and fetch literature abstracts, clinical trials, and pharmacological data.
- bcrypt: [bcrypt documentation](https://www.npmjs.com/package/bcrypt). Used for cryptographic password hashing and password verification in admin authentication routes.
