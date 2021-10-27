const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors =require('cors');


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adlv3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('DB connected')
        const database = client.db("carservicing");
        const servicesCollection = database.collection('services');

        //GET API 
        app.get('/services', async (req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //Get single Service
        app.get('/services/:id', async(req, res)=>{
            const id= req.params.id;
           // console.log('getting specific id', id);
           const query = {_id:ObjectId(id)};
           const service = await servicesCollection.findOne(query);
            res.json(service);
        });
        //POST API
        app.post('/services', async (req, res) =>{
            const service = req.body;
           // console.log('hitting the api', service1);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result)
        });
         // DELETE API
         app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);

app.get ('/', (req, res) =>{
    res.send('Hello..car servicing  Node Server running');
})
app.get ('/hello', (req, res) =>{
    res.send('hrkoku server running');
})


app.listen(port, ()=> {
    console.log('Listening Port', port);
})