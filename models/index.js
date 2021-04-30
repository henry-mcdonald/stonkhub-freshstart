const mongoose = require('mongoose')
require('dotenv')
console.log(process.env.NODE_ENV)


let uri 
if (process.env.NODE_ENV === "development") {

    uri = process.env.MONGO_URI || 'mongodb://localhost/related'
    
} else {

    uri = process.env.ATLAS_URI
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("test").collection("devices");
        // perform actions on the collection object
        client.close();
    });
    
}

mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.once('open', () => {
    console.log(`Mongoose is running ${db.host}: ${db.port}`)
})

db.on('error', (err) => {
    console.error(`Mongoose IS NOT connected\n ${err}`)
})