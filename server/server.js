import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'// middleware making object 
import { MongoClient, ObjectId } from 'mongodb';


const app = express()
app.use(cors()); // middleware 
app.use(bodyParser.json());


const uri = process.env.REACT_APP_MONGODB_KEY
const client = new MongoClient(uri); // creating instance 
const db = client.db("CivicHeart"); // referrencing db

let serverPortNum = 5000;

async function main() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        app.listen(serverPortNum, () => {console.log(`Server started on port ${serverPortNum}`)})
    } catch (error) {
        console.error(error);
    }
}

/* Member */

app.get("/api/addMember", async (req, res) => {
    let data = req?.body;

    if (!data.hasOwnProperty("districtNum")) {
        console.error("ERROR: No district number received");
        res.send(null);
    } else if (!data.hasOwnProperty("name")) {
        data.name = null;
    } else if (!data.hasOwnProperty("borough")) {
        data.borough = null;
    } else if (!data.hasOwnProperty("party")) {
        data.party = null;
    } else if (!data.hasOwnProperty("districts")) {
        data.districts = null;
    } else if (!data.hasOwnProperty("email")) {
        data.email = null;
    } else if (!data.hasOwnProperty("zipCodes")) {
        data.zipCodes = null;
    } else if (!data.hasOwnProperty("imageURL")) {
        data.imageURL = null;
    }
    const result = await db.collection("members").insertOne(data);
    res.send(result);
});

app.get("/api/getMember", async (req, res) => {
    let zipCode = (req?.body).zipCode;
    zipCode = parseInt(zipCode);
    const result = await db.collection("members").find({ zipCodes: { $in: [zipCode]}}).toArray();
    if (result.length == 0) {
        console.error(`ERROR: No council members found for zip code ${zipCode}`);
        res.send(null);
    } else {
        res.json(result[0]);
    }
});

app.post("/api/deleteMember", async (req, res) => {
    console.log("deleteMember received");

    //Finds the note in body of req and deletes it from the database
    const districtNum = (req?.body).districtNum;
    const result = await db.collection("members").deleteOne({districtNum: districtNum});

    //Error check if the deletion didn't work
    if (result.deletedCount == 0) {
        console.error(`ERROR: Member ${districtNum} was not deleted`);
    }
    res.send(result);
});

app.post("/api/updateMember", async (req, res) => {
    console.log("updateMember received");
    const data = req?.body;
    // check if the data is valid
    if (!data) {
        console.error("ERROR: No data received");
        res.send(null);
    } else if (!data.districtNum) {
        console.error("ERROR: No district number received");
        res.send(null);
    }
    const result = await db.collection("members").updateOne({districtNum: data.districtNum}, {$set: data});
    res.send(result);
});


/* Users */

app.post("/api/addUser", async (req, res) => {
    console.log("addUser req received");

    //Finds the note in body of req and adds it to the database
    const data = req?.body;
    const result = await db.collection("users").insertOne(data);
    res.send(result);
});

app.get("/api/getUser", async (req, res) => {
    const data = await db.collection("users").find().toArray();
    res.json(data);
});


/* Laws */


/* Issues */


main().catch(console.error);

