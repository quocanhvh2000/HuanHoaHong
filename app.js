var express = require('express');
var app = express();
var engine = require('consolidate');
const PORT = process.env.PORT || '3000';
var {database} = require('./db/db');

var bodyParser = require("body-parser");
const { registerDecorator } = require('handlebars');
const { MongoClient } = require('mongodb');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./public'));

app.engine('hbs', engine.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', async function(req,res){
    // database('studentDB')
    // .then(db => {
    //     db.collection('student').find().toArray().then(data => res.render('index.hbs', {data: data}));
    // })
    let db = await database('ToyStory');//cho ket noi den co so du lieu
    let result = await db.collection('toys').find({}).toArray();//cho lay dc du lieu
    console.log(result);
    res.render("index.hbs",{data:result});
});

app.get('/delete', async (req,res)=>{   
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID; //lay id object
    console.log(ObjectID);
    let condition = {"_id" : ObjectID(id)};
    let db = await database('ToyStory');
    await db.collection('toys').deleteOne(condition);
    res.redirect('/');
})

app.get('/add',async(req,res)=>{
    res.render('addToy');
});

app.post('/add', async(req,res) => {
    let db = await database('ToyStory');
    let name = req.body.txtName;
    let image = req.body.txtImage;
    let amount = req.body.txtAmount;
    let cost = req.body.txtCost;
    let addProduct = {Name: name,Image: image, Amount: amount,Cost: cost};
    await db.collection("toys").insertOne(addProduct);
    res.redirect('/'); //reload
})

app.get('/update',async(req,res)=>
{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID; 
    let db = await database('ToyStory');
    let result = await db.collection("toys").findOne({'_id' : ObjectID(id)});
    console.log(result);
    res.render('update.hbs',{data:result});
}),

app.post("/doupdate",async(req,res)=>{
    let id = req.body.id;
    let name = req.body.txtName;
    let image = req.body.txtImage;
    let amount = req.body.txtAmount;
    let cost = req.body.txtCost;
    let newValues ={$set : {Name: name,Image: image, Amount: amount,Cost: cost}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    
    let db = await database("ToyStory");
    await db.collection("toys").updateOne(condition,newValues);
    //
    // let results = await dbo.collection("products").find({}).toArray();
    // res.render('index',{products:results});
    res.redirect('/')

})
app.listen(PORT, function(){
    console.log('app listen port ' + PORT );
});

