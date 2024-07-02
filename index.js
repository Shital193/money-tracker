const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.port || 3000;
const Username = process.env.MongoDBUsername;
const Password = process.env.MongoDBPassword;
const dbName = process.env.dbName;
app.use(bodyparser.json());
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));

mongoose.connect(`mongodb+srv://${Username}:${Password}@cluster0.pvlbsey.mongodb.net/${dbName}`, {});
const database = mongoose.connection;
database.on('error', ()=> console.log("Error in connecting database"));
database.once('open', ()=> console.log("Connected to dstabase"));

app.post("/insert", async (req,res) =>{
    try{
        const {category_select, amount_input, info, date_input } = req.body;
        const inputData = {
            Category: String(category_select),
            Amount: Number(amount_input),
            Info: String(info),
            Date: (date_input)
        };
        database.collection('users').insertOne((inputData), (err, collection) => {
            if(err){
                console.log("Error inserting Data");
                res.status(500).json({ message: "Error inserting Data"});
            }
            console.log("Data inserted Successfully");
            res.status(200).json({ message: "Data inserted successfully"});
        });
    }
    catch(error){
        console.log(error);
        res.redirect('/');
    }
});

app.get("/", (req,res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});
