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
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
async function run(){
    try{
        const serviceCollection = client.db("upturn").collection("services");
        const reviewCollection = client.db("upturn").collection("reviews");

        app.get('/limitServices', async (req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })
        app.get('/services', async (req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        app.post('/reviews', async (req, res) =>{
            const order = req.body;
            const result = await reviewCollection.insertOne(order)
            res.send(result)
            console.log(result);
        })
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
