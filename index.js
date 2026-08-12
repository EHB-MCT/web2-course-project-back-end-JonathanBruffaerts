/**
 * Source: Mike Derycke (Boardgame REST API) - https://www.youtube.com/watch?v=3Ykr6dZjXhE
 * Parts used: Implementation of Post-route logic for mongodb
 */


const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB setup
const uri = process.env.MONGODB_URI;
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

app.get("/compounds", async (req, res) => {
    try {

        const filter = {};

        if (req.query.search) {
            filter.name = {
                $regex: req.query.search,
                $options: "i"
            };
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        let sort = {};

        switch (req.query.sort) {

            case "name":
                sort = { name: 1 };
                break;

            case "toxicity":
                sort = { toxicityLevel: 1 };
                break;

            case "anabolic":
                sort = { anabolicRatio: -1 };
                break;

            case "androgenic":
                sort = { androgenicRatio: -1 };
                break;

            default:
                sort = { name: 1 };
        }

        const results = await compounds
            .find(filter)
            .sort(sort)
            .toArray();

        res.status(200).json({
            message: "Compounds retrieved successfully",
            count: results.length,
            data: results
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve compounds"
        });

    }
});

app.get('/compounds/:id', async (req, res) => {
    try {
        const compound = await compounds.findOne({
            compoundId: req.params.id
        });

        if (!compound) {
            return res.status(404).json({
                message: "Compound not found"
            });
        }

        res.status(200).json({
            message: "Compound retrieved successfully",
            data: compound
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.post('/compounds', async (req, res) => {
  try {
    const newCompound = req.body;

    // Easter Egg: Restrict Compound V (Fixed variable reference)
    if (newCompound.name?.toLowerCase() === 'compound v') {
      return res.status(418).json({ 
        error: "Vought Protocol 7", 
        message: "Injecting Compound V is restricted to licensed superheroes only." 
      });
    }
    
    // Define required fields
    const requiredFields = [
      'compoundId', 'name', 'category', 'anabolicRatio', 'androgenicRatio',
      'toxicityLevel', 'mechanismOfAction', 'halfLife', 'administrationRoute',
      'biomarkers', 'sideEffects', 'studyIds'
    ];
    
    // Check for missing fields
    const missingFields = requiredFields.filter(field => !(field in newCompound));
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields
      });
    }

    // Validate data types
    if (typeof newCompound.compoundId !== "string") {
      return res.status(400).json({ message: "Compound ID must be a string." });
    }
    if (typeof newCompound.name !== "string") {
      return res.status(400).json({ message: "Name must be a string." });
    }
    if (!Array.isArray(newCompound.category)) {
      return res.status(400).json({ message: "Category must be an array of strings." });
    }
    if (typeof newCompound.anabolicRatio !== "number") {
      return res.status(400).json({ message: "Anabolic ratio must be a number." });
    }
    if (typeof newCompound.androgenicRatio !== "number") {
      return res.status(400).json({ message: "Androgenic ratio must be a number." });
    }
    if (typeof newCompound.toxicityLevel !== "number") {
      return res.status(400).json({ message: "Toxicity level must be a number." });
    }
    if (typeof newCompound.halfLife !== "number") {
      return res.status(400).json({ message: "Half-life must be a number." });
    }
    if (typeof newCompound.mechanismOfAction !== "string") {
      return res.status(400).json({ message: "Mechanism of action must be a string." });
    }
    if (typeof newCompound.administrationRoute !== "string") {
      return res.status(400).json({ message: "Administration route must be a string." });
    }
    // Fixed biomarkers type check (Object, not Array)
    if (typeof newCompound.biomarkers !== "object" || newCompound.biomarkers === null || Array.isArray(newCompound.biomarkers)) {
      return res.status(400).json({ message: "Biomarkers must be an object." });
    } 
    if (!Array.isArray(newCompound.sideEffects)) {
      return res.status(400).json({ message: "Side effects must be an array." });
    }
    if (!Array.isArray(newCompound.studyIds)) {
      return res.status(400).json({ message: "Study IDs must be an array." });
    }

    // Check if compound already exists
    const existingCompound = await compounds.findOne({ compoundId: newCompound.compoundId });
    if (existingCompound) {
      return res.status(409).json({
        message: 'Compound with this compoundId already exists'
      });
    }
    
    // Insert the new compound
    const result = await compounds.insertOne(newCompound);
    res.status(201).json({
      message: 'Compound created successfully',
      data: {
        insertedId: result.insertedId,
        compound: newCompound
      }
    });
  } catch (error) {
    console.error('Error adding compound:', error);
    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
});

app.delete('/compounds/:id', async (req, res) => {
  try {

    const result = await compounds.deleteOne({
      compoundId: req.params.id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Compound not found'
      });
    }

    res.status(200).json({
      message: 'Compound deleted successfully',
      deletedCompoundId: req.params.id
    });

  } catch (error) {

    console.error('Error deleting compound:', error);

    res.status(500).json({
      message: 'Internal Server Error'
    });

  }
});

app.put('/compounds/:id', async (req, res) => {
  try {
    const updatedCompound = req.body;

    const result = await compounds.updateOne(
      { compoundId: req.params.id },
      { $set: updatedCompound }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Compound not found'
      });
    }

    const compound = await compounds.findOne({
      compoundId: req.params.id
    });

    res.status(200).json({
      message: 'Compound updated successfully',
      data: compound
    });

  } catch (error) {
    console.error('Error updating compound:', error);

    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
});

app.get("/categories", async (req, res) => {
    try {
        const categories = await compounds.aggregate([
            { $unwind: "$category" },
            { $group: { _id: "$category" } },
            { $sort: { _id: 1 } }
        ]).toArray();

        // Extract the category string names from the aggregated documents
        const categoryList = categories.map(item => item._id);

        res.status(200).json({
            data: categoryList
        });

    } catch (error) {
        console.error("Categories error:", error);
        res.status(500).json({
            message: "Failed to retrieve categories"
        });
    }
});



app.get('/api/pubmed/search', async (req, res) => {
  try {
    const query = req.query.q;
    // Default to '*' which tells Europe PMC to start at page 1
    const cursor = req.query.cursorMark || '*'; 
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Pass the cursorMark into the Europe PMC API
    const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&resultType=core&cursorMark=${encodeURIComponent(cursor)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.resultList || data.resultList.result.length === 0) {
      return res.status(200).json({ data: [], nextCursorMark: null, hitCount: 0 });
    }

    const studies = data.resultList.result.map(study => ({
      id: study.pmid || study.id,
      title: study.title,
      journal: study.journalTitle || 'Unknown Journal',
      pubDate: study.firstPublicationDate || study.pubYear || 'Unknown Date',
      authors: study.authorString || 'Unknown Authors',
      abstract: study.abstractText || null,
      link: study.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/` : `https://europepmc.org/article/MED/${study.id}`
    }));

    // Send back the data, the next page cursor, and total hits
    res.status(200).json({ 
      data: studies, 
      nextCursorMark: data.nextCursorMark,
      hitCount: data.hitCount 
    });

  } catch (error) {
    console.error('Literature API Error:', error);
    res.status(500).json({ message: "Failed to fetch from literature database" });
  }
});  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});