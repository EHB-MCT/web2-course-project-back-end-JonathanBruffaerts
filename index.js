/**
 * Source: Mike Derycke (Boardgame REST API) - https://www.youtube.com/watch?v=3Ykr6dZjXhE
 * Parts used: Implementation of Post-route logic for mongodb
 */

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
    database = client.db('courseproject-web2');
    compounds = database.collection('compounds');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/compounds', async (req, res) => {
  try {
    const allCompounds = await compounds.find({}).toArray();
    res.json(allCompounds);
  } catch (error) {
    console.error('Error fetching compounds:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/compounds', async (req, res) => {
  try {
    const newCompound = req.body;

    // Easter Egg: Restrict Compound V
    if (data.name?.toLowerCase() === 'compound v') {
      return res.status(418).json({ 
        error: "Vought Protocol 7", 
        message: "Injecting Compound V is restricted to licensed superheroes only." 
      });
    }
    
    // Define required fields
    const requiredFields = [
      'compoundId', 'name', 'category', 'anabolicRatio', 'androgenicRatio',
      'toxicityLevel', 'mechanismOfAction', 'halfLife', 'administrationRoute',
      'chemicalStructure', 'biomarkers', 'sideEffects', 'studyIds'
    ];
    
    // Check for missing fields
    const missingFields = requiredFields.filter(field => !(field in newCompound));
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }
    
    // Check if compound already exists
    const existingCompound = await compounds.findOne({ compoundId: newCompound.compoundId });
    if (existingCompound) {
      return res.status(409).json({ error: 'Compound with this compoundId already exists' });
    }
    
    // Insert the new compound
    const result = await compounds.insertOne(newCompound);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding compound:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/compounds/:id', async (req, res) => {
  try {
    const result = await compounds.deleteOne({ compoundId: req.params.id });  // Use compoundId instead of _id
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No compound found to delete' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.put('/compound/:id', async (req, res) => {
  try {
    const updatedCompound = req.body;
    const result = await compounds.updateOne({ compoundId: req.params.id }, { $set: updatedCompound });  // Use compoundId instead of _id
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Compound not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error updating compound:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/compound', async (req, res) => {
  try {
    const query = { compoundId: req.query.id };
    const compound = await compounds.findOne(query);
    
    if (!compound) {
      return res.status(404).json({ error: 'Compound not found' });
    }
    res.json(compound);
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});