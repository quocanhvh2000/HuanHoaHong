var {MongoClient} = require('mongodb');

const uri = "mongodb+srv://quocanhvh2000:anhtqgch18634@cluster0.dr7wp.mongodb.net/test?retryWrites=true&w=majority";

async function database(name){
    const client = new MongoClient(uri);
//ket noi mongodb
    try{
        await client.connect();
        dbo = client.db(name);
        return dbo;
    }
    catch(err) {
        console.error(err);
    }
}

module.exports = {database};
