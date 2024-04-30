const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


//middlewares
app.use(cors());
app.use(express.json());








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uo3rphs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const craftsCollection = client.db("CraftDB").collection("crafts");
        const userCollection = client.db("CraftDB").collection("users");



        app.get('/crafts', async (req, res) => {
            const cursor = craftsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/crafts/:email', async (req, res) => {
            console.log(req.params.email)
            const result = await craftsCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })


        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftsCollection.findOne(query);
            res.send(result);


        })


        app.post('/crafts', async (req, res) => {
            const newCraft = req.body;
            console.log(newCraft)
            const result = await craftsCollection.insertOne(newCraft);
            res.send(result)
        })


        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateCraft = req.body;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCraft = {
                $set: {
                    photo: updateCraft.photo,
                    item: updateCraft.item,
                    subcategory: updateCraft.subcategory,
                    price: updateCraft.price,
                    processing: updateCraft.processing,
                    description: updateCraft.description,
                    rating: updateCraft.rating,
                    customization: updateCraft.customization,
                    stockStatus: updateCraft.stockStatus,
                    email: updateCraft.email,
                    name: updateCraft.name

                }
            }

            const result = await craftsCollection.updateOne(query, updatedCraft, options);
            res.send(result);


        })



        app.delete('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftsCollection.deleteOne(query);
            res.send(result);



        })













        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







//routes

app.get('/', (req, res) => {
    res.send('art and craft server is running')
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})