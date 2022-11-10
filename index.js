const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nl9uncn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db("upturn").collection("services");
        const reviewCollection = client.db("upturn").collection("reviews");

        // to get only 3 service data from database 
        app.get('/limitServices', async (req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })

        // to get all service data from database
        app.get('/services', async (req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        //to post new service on the website and database
        app.post('/services', async (req, res) =>{
            const order = req.body;
            const result = await serviceCollection.insertOne(order)
            res.send(result)
            console.log(result);
        })

        // to get the chlicked data by its id 
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        //to post reviews on the database from the website
        app.post('/reviews', async (req, res) =>{
            const order = req.body;
            const result = await reviewCollection.insertOne(order)
            res.send(result)
            console.log(result);
        })

        //to get reviews data by query from database
        app.get('/reviews', async (req, res) =>{
            let query ={}
            if(req.query.email){
                query = {
                    email: req.query.email 
                }
            }
            if(req.query.service){
                query = {
                    service: req.query.service 
                }
            }
            const cursor = reviewCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })

        //to delete a particular review from website and databse
        app.delete('/reviews/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(error => console.error(error))







app.get('/', (req, res) =>{
    res.send('upturn server is running')
})

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
})
