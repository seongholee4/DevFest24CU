import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'// middleware making object 
import { MongoClient, ObjectId } from 'mongodb';

const crypto = require( 'crypto' );


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
    }
    if (!data.hasOwnProperty("name")) {
        data.name = null;
    }
    if (!data.hasOwnProperty("borough")) {
        data.borough = null;
    }
    if (!data.hasOwnProperty("party")) {
        data.party = null;
    }
    if (!data.hasOwnProperty("districts")) {
        data.districts = null;
    }
    if (!data.hasOwnProperty("email")) {
        data.email = null;
    }
    if (!data.hasOwnProperty("zipCodes")) {
        data.zipCodes = null;
    }
    if (!data.hasOwnProperty("imageURL")) {
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

app.get("/api/addUser", async (req, res) => {
    let data = req?.body;

    if (!data.hasOwnProperty("ssn")) {
        console.error("ERROR: No SSN received");
        res.send(null);
    } else if (!data.hasOwnProperty("userName")) {
        console.error("ERROR: No username received");
        res.send(null);
    }
    if (!data.hasOwnProperty("name")) {
        data.name = null;
    }
    if (!data.hasOwnProperty("zipCode")) {
        data.zipCode = null;
    }
    if (!data.hasOwnProperty("phoneNumber")) {
        data.phoneNumber = null;
    }
    if (!data.hasOwnProperty("preferences")) {
        data.preferences = null;
    }
    if (!data.hasOwnProperty("ccMember")) {
        data.ccMember = null;
    }
    if (!data.hasOwnProperty("password")) {
        data.password = null;
    
    //Will SHA-1 hash the password if passed in
    } else if (data.hasOwnProperty("password")) {
        data.password = crypto.createHash('sha1').update(data.password).digest('hex');
    }
    //SHA-1's the SSN
    data.ssn = crypto.createHash('sha1').update(data.ssn).digest('hex');

    const result = await db.collection("users").insertOne(data);
    res.send(result);
});


app.get("/api/getUser", async (req, res) => {
    console.log("getUser received");
    let inputUserName = (req?.body).userName;
    const result = await db.collection("users").find({ userName: inputUserName}).toArray();
    assert(result.length <= 1);
    if (result.length == 0) {
        console.error("ERROR: No user found");
    }else {
        res.json(result);
    }
});


app.post("/api/deleteUser", async (req, res) => {
    console.log("deleteUser received");

    //Finds the note in body of req and deletes it from the database
    const inputUserName = (req?.body).userName;
    const result = await db.collection("users").deleteOne({userName: inputUserName});

    //Error check if the deletion didn't work
    if (result.deletedCount == 0) {
        console.error(`ERROR: User was not deleted`);
    }
    res.send(result);
});


app.post("/api/updateUser", async (req, res) => {
    console.log("updateUser received");
    const data = req?.body;

    //Makes sure to encrypt SSN
    if (data.ssn) {
        data.ssn = crypto.createHash('sha1').update(data.ssn).digest('hex');
    }

    // check if the data is valid
    if (!data) {
        console.error("ERROR: No data received");
        res.send(null);
    } else if ((!data.ssn) && (!data.userName)) {
        console.error("ERROR: No user received");
        res.send(null);
    }

    //Updates based on which of the two unique keys is present
    if (!data.ssn) {
        const result = await db.collection("users").updateOne({userName: data.userName}, {$set: data});
    } else {
        const result = await db.collection("users").updateOne({ssn: data.ssn}, {$set: data});
    }
    res.send(result);
});



/* Laws */


/* Issues */


main().catch(console.error);