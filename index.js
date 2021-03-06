const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;



const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhzyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tourism');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('order');

        //Get API

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        });

        //Get API single service to booking

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting booking service', id);
            const query = { _id: ObjectId(id) };
            const services = await servicesCollection.findOne(query);
            res.send(services);

        });

        //POST API

        app.post('/services/', async (req, res) => {
            //console.log("hit hit");
            const Service = req.body;
            const result = await servicesCollection.insertOne(Service);
            console.log("added service", result);
            res.send(result);
        });

        //add order item

        app.post("/addorder", async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            console.log(result);
            res.send(result);
        });

        // get my orders list

        app.get("/myOrders/:email", async (req, res) => {
            //console.log(req.params.email);
            const result = await ordersCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        });



        //DELETE Orders

        app.post('/orders-delete/:id', async (req, res) => {
            const id = req.params.id;
            //console.log('hello', id);
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
            //console.log('hello');
        });


        //DELETE API 

        app.post('/services-delete/:id', async (req, res) => {
            const id = req.params.id;
            console.log('hello', id);
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
            console.log('hello');
        });
    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running my server for Assignment 11");
});

app.listen(port, () => {
    console.log('Running services Server on Port', port);
});