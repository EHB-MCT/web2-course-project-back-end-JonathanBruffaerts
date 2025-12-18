const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const credentials = require('./credentials.js');


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB setup
const uri = `mongodb+srv://${credentials.username}:${credentials.password}@cluster0.xdx4ahi.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;
let compounds;

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    database = client.db('web2-course-project');
    compounds = database.collection('compounds');
    // Add your routes here, e.g.:
    // app.get('/compounds', async (req, res) => { ... });
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});