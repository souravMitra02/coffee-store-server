const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssk8yog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




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
      const coffeeCollection = client.db('coffeeDB').collection('coffees');
      const userCollection = client.db('coffeeDB').collection('users');

      app.get('/coffees', async (req, res) => {
          const result = await coffeeCollection.find().toArray();
          res.send(result);
    })

      app.get('/coffees/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await coffeeCollection.findOne(query);
          res.send(result);
})


      app.post('/coffees', async (req, res) => {
          const newCoffee = req.body;
          console.log(newCoffee);
          const result = await coffeeCollection.insertOne(newCoffee);
          res.send(result);
    })

      
      app.put('/coffees/:id', async (req,res) => {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          const updatedCoffee = req.body;
          const updatedDoc = {
              $set: updatedCoffee
          }

          const result = await coffeeCollection.updateOne(filter, updatedDoc, options);
          res.send(result);
   })   
      

      app.delete('/coffees/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await coffeeCollection.deleteOne(query);
          res.send(result);
      })


      app.get('/users', async (req, res) => {
          const result = await userCollection.find().toArray();
          res.send(result);
      })




      app.post('/users', async (req, res) => {
          const userProfile = req.body;
          console.log(userProfile);
          const result = await userCollection.insertOne(userProfile);
          res.send(result);
      })

      app.delete('/users/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await userCollection.deleteOne(query);
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




app.get('/', (req, res) => {
    res.send('coffee server is getting hotter');
})

app.listen(port, () => {
     console.log(`Example app listening on port ${port}`)
})