import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'// middleware making object 
import { MongoClient, ObjectId } from 'mongodb';

import crypto from 'crypto';


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

//Will add a council city member to the member database
//Body of request should be:
/*
{
    districtNum: <district number>,
    name: <councilman name>,
    borough: <array of boroughs the person represents>,
    party: <political party>,
    districts: <array of neighborhoods represented>,
    email: <email of councilman>,
    zipCodes: <array of zipcodes councilman represents>,
    imageURL: <url of face>
}
*/
app.post("/api/addMember", async (req, res) => {
    let data = req?.body;

    if (!data.hasOwnProperty("districtNum")) {
        console.error("ERROR: No district number received");
        res.send(null);
        return;
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


//Returns object of councilman
//Body of request should be: {zipCode: <zipCode value>}
app.get("/api/getMember", async (req, res) => {
    let zipCode = (req?.body).zipCode;
    zipCode = parseInt(zipCode);
    const result = await db.collection("members").find({ zipCodes: { $in: [zipCode]}}).toArray();
    if (result.length == 0) {
        console.error(`ERROR: No council members found for zip code ${zipCode}`);
        res.send(null);
        return;
    } else {
        res.json(result[0]);
    }
});


//Deletes councilmember from database
//Body of request should be: {districtNumber: <districtNumber of councilmember>}
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

//Updates member information
//Use same body as /api/addMember
app.post("/api/updateMember", async (req, res) => {
    console.log("updateMember received");
    const data = req?.body;
    // check if the data is valid
    if (!data) {
        console.error("ERROR: No data received");
        res.send(null);
        return;
    } else if (!data.districtNum) {
        console.error("ERROR: No district number received");
        res.send(null);
        return;
    }
    const result = await db.collection("members").updateOne({districtNum: data.districtNum}, {$set: data});
    res.send(result);
});


/* Users */

//Adds user
//Body of request should be:
/*
{
    ssn: <10 digit number (will be SHA-1'd here)>,
    userName: <username>,
    name: <array of boroughs the person represents>,
    party: <full name>,
    zipCode: <5 digit #>,
    phoneNumber: <10 digit number no hyphens>,
    preferences: <array of issues user likes>,
    ccMember: <councilmember who represents user>,
    password: <raw password of user (will be SHA-1'd here)>
}
*/
app.post("/api/addUser", async (req, res) => {
    let data = req?.body;

    if (!data.hasOwnProperty("ssn")) {
        console.error("ERROR: No SSN received");
        res.send(null);
        return;
    } else if (!data.hasOwnProperty("userName")) {
        console.error("ERROR: No username received");
        res.send(null);
        return;
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


//Returns user
//Body of request should be:
/*
{
    userName: <username>
}
*/
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


//Deletes user
//Body of request should be:
/*
{
    userName: <username>
}
*/
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


//Updates user
//Body of request should be:
/*
{
    ssn: <10 digit number (will be SHA-1'd here)>,
    userName: <username>,
    name: <array of boroughs the person represents>,
    party: <full name>,
    zipCode: <5 digit #>,
    phoneNumber: <10 digit number no hyphens>,
    preferences: <array of issues user likes>,
    ccMember: <councilmember who represents user>,
    password: <raw password of user (will be SHA-1'd here)>
}
*/
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
        return;
    } else if ((!data.ssn) && (!data.userName)) {
        console.error("ERROR: No user received");
        res.send(null);
        return;
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
//Body of request should be:
/*
{
    fileNum: <fileNum code of the law as seen on https://legistar.council.nyc.gov/Legislation.aspx>,
    name: <name of law>,
    status: <law status as seen on https://legistar.council.nyc.gov/Legislation.aspx>,
    committee: <committee law is assigned to as seen on https://legistar.council.nyc.gov/Legislation.aspx>,
    sponsor: <array of councilmen who sponsor the law>,
    summary: <summary of law>,
    data: <date law is brought to NYCC>,
    ccMember: <councilmember who represents user>,
    password: <raw password of user (will be SHA-1'd here)>
}
*/
app.post("/api/addLaw", async (req, res) => {
    let data = req?.body;

    if (!data.hasOwnProperty("fileNum")) {
        console.error("ERROR: No fileNum received");
        res.send(null);
        return;
    }
    if (!data.hasOwnProperty("name")) {
        data.name = null;
    }
    if (!data.hasOwnProperty("status")) {
        data.status = null;
    }
    if (!data.hasOwnProperty("committee")) {
        data.committee = null;
    }
    if (!data.hasOwnProperty("sponsor")) {
        data.sponsor = null;
    }
    if (!data.hasOwnProperty("summary")) {
        data.summary = null;
    }
    if (!data.hasOwnProperty("date")) {
        data.date = null;
    }
    const result = await db.collection("laws").insertOne(data);
    res.send(result);
});

app.get("/api/getLaw", async (req, res) => {
    const fileNum = (req?.body).fileNum;
    if (!fileNum) {
        console.error("ERROR: No file number received");
        res.send(null);
        return;
    }
    const result = await db.collection("laws").find({ fileNum: fileNum}).toArray();
    if (result.length == 0) {
        console.error(`ERROR: No law found with file number ${fileNum}`);
        res.send(null);
        return;
    } else {
        res.json(result);
    }
});


//Body of request should be:
/*
{
    fileNum: <fileNum code of the law as seen on https://legistar.council.nyc.gov/Legislation.aspx>
}
*/
app.post("/api/deleteLaw", async (req, res) => {
    console.log("deleteLaw received");

    //Finds the note in body of req and deletes it from the database
    const fileNum = (req?.body).fileNum;
    if (!fileNum) {
        console.error("ERROR: No file number received");
        res.send(null);
        return;
    }
    const result = await db.collection("laws").deleteOne({fileNum: fileNum});

    //Error check if the deletion didn't work
    if (result.deletedCount == 0) {
        console.error(`ERROR: Law ${fileNum} was not deleted`);
    }
    res.send(result);
});


//Body of request should be:
/*
{
    fileNum: <fileNum code of the law as seen on https://legistar.council.nyc.gov/Legislation.aspx>,
    name: <name of law>,
    status: <law status as seen on https://legistar.council.nyc.gov/Legislation.aspx>,
    committee: <committee law is assigned to as seen on https://legistar.council.nyc.gov/Legislation.aspx>,
    sponsor: <array of councilmen who sponsor the law>,
    summary: <summary of law>,
    data: <date law is brought to NYCC>,
    ccMember: <councilmember who represents user>,
    password: <raw password of user (will be SHA-1'd here)>
}
*/
app.post("/api/updateLaw", async (req, res) => {
    console.log("updateLaw received");
    const data = req?.body;
    // check if the data is valid
    if (!data) {
        console.error("ERROR: No data received");
        res.send(null);
        return;
    } else if (!data.fileNum) {
        console.error("ERROR: No file number received");
        res.send(null);
        return;
    }
    const result = await db.collection("laws").updateOne({fileNum: data.fileNum}, {$set: data});
    res.send(result);
});



/* Votes */

//Adds vote to the total vote database
app.post("/api/addVote", async(req, res) => {
    console.log("addVote req received!");
    //Assume that the front end will pass in the body of the POST request as follows:
    /*
    { userName: person's username,
      fileNum: the code of the legislation being passed
      vote: either a "Y" string or "N" string to indicate yes or no vote
    }
    */

    const data = req?.body;

    //Error checks
    if (!data.hasOwnProperty("fileNum")) {
        console.error("ERROR: No fileNum received");
        res.send(null);
        return;
    }
    if (!data.hasOwnProperty("userName")) {
        console.error("ERROR: No username received");
        res.send(null);
        return;
    }
    if (!data.hasOwnProperty("vote")) {
        console.error("ERROR: No vote received");
        res.send(null);
        return;
    } else if (data.vote != "Y" && data.vote != "N") {
        console.error("ERROR: Vote is not 'Y' or 'N'!");
        res.send(null);
        return;
    }

    //updateOne will replace existing vote with new vote
    //if no existing vote, will just insert one with insertOne method
    console.log(data);
    console.log("\n")

    let result = await db.collection("votes").updateOne({userName: data.userName, fileNum: data.fileNum}, {$set: data});

    if (result.modifiedCount == 0) {
        result = await db.collection("votes").insertOne(data); 
    }

    res.send(result);

});


// Returns total yes/no tally of votes for inputted issue
app.get("/api/getVotes", async(req, res) => {
    //Assumes front end requested fileNum in body:
    /*
    {
        fileNum: fileNum code as seen in laws database
    }
    */
    const data = req?.body;

    //Error checks
    if (!data.hasOwnProperty("fileNum")) {
        console.error("ERROR: No fileNum received");
        res.send(null);
        return;
    }

    const inputFileNum = data.fileNum;

    const yesVotes = await db.collection("votes").countDocuments({fileNum: inputFileNum, vote: "Y"});
    const noVotes = await db.collection("votes").countDocuments({fileNum: inputFileNum, vote: "N"});

    const result = {
        yesCount: yesVotes,
        noCount: noVotes
    }

    res.send(result);

});




/* Issues */
//Will return all 10 pregenerated issues back to front end
app.get("/api/getIssues", async(req, res) => {

    //NOTE: This is a dummy method! It will just return all issues in the database
    
    console.log("getIssues recieved!");

    const result = await db.collection("issues").find({}).toArray();

    res.json(result);

});


main().catch(console.error);