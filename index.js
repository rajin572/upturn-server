const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/limitServices', async (req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(err => console.error(err))







app.get('/', (req, res) =>{
    res.send('upturn server running')
})

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
})
