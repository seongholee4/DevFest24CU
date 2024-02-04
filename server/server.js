import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
const app = express()

const uri = process.env.REACT_APP_MONGODB_KEY

import cors from 'cors'
import bodyParser from 'body-parser'// middleware making object 
app.use(cors()); // middleware 
app.use(bodyParser.json());
import { MongoClient, ObjectId } from 'mongodb';
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


//Fetching of data from database
app.get("/api/getUsers", async (req, res) =>{
    const data = await db.collection("users").find().toArray();
    res.json(data);
});


//Fetching of data from database
app.get("/api/getMembers", async (req, res) =>{
    const data = await db.collection("members").find().toArray();
    res.json(data);
});




//Called when a user must be added
app.post("/api/addUser", async (req, res) => {
    console.log("addUser req received");

    //Finds the note in body of req and adds it to the database
    const data = req?.body;
    const result = await db.collection("users").insertOne(data);
    res.send(result);
})

//Called when a council member must be added
app.post("/api/addMember", async (req, res) => {
    console.log("addMember req received");

    //Finds the note in body of req and adds it to the database
    /*const data ={
        districtNum:5,
        name:"Julie Menin",
        borough: ["Manhattan"],
        party:"Democrat",
        districts:[
            "East Midtown-Turtle Bay", "United Nations", "Upper East Side-Lenox Hill-Roosevelt Island", "Upper East Side-Carnegie Hill", "Upper East Side-Yorkville"
        ],
        email: "District5@council.nyc.gov",
        zipCodes: [10017, 10022, 10021, 10028]};*/
    const data = req?.body;
    const result = await db.collection("members").insertOne(data);
    res.send(result);
})


//Called when a user must be added
app.post("/api/addLaw", async (req, res) => {
    console.log("addLaw req received");

    //Finds the note in body of req and adds it to the database
    const data = req?.body;
    /*
    const data = {
        fileNum: "T2024-0072",
        name: "Safety standards for powered bicycles and powered mobility devices used for food delivery services.",
        status: "Committee",
        committee: "Committee on Consumer and Worker Protection",
        sponsor: ["Oswald Feliz", "Keith Powers", "Shaun Abreu", "Rita C. Joseph", "Gale A. Brewer"],
        summary: "This bill would establish safety standards for powered bicycles and powered mobility devices when used for food delivery services. Specifically, the bill requires that any powered mobility device operated by a food delivery worker on behalf of a third-party delivery service or third-party courier service, meet local standards established for the sale of such device, which includes certification by an accredited testing laboratory. Third-party delivery services or third-party courier services would be responsible for providing food delivery workers with such devices at no expense to the worker. Finally, responsibility for compliance with these provisions would fall on the third-party delivery service or third-party courier service, which would be subject to civil penalties for any violations.",
        date: "2024-02-08"
    }
    */

    const result = await db.collection("laws").insertOne(data);
    res.send(result);
})

//Called when a council member must be replaced
app.post("/api/replaceMember", async (req, res) => {
    console.log("replaceMember req received");

    //Finds the note in body of req and adds it to the database
    //const data = req?.body;
    const query={"districtNum": 8}
    const data ={
        districtNum:8,
        name:"Diana Ayala",
        borough: ["Manhattan", "Bronx"],
        party:"Democrat",
        districts:[
            "Mott Haven-Port Morris", "Melrose", "Concourse-Concourse Village", "Upper East Side-Carnegie Hill", "Upper East Side-Yorkville", "East Harlem (South)", "East Harlem (North)", "Randall's Island"
        ],
        email: "District8@council.nyc.gov"};    
    const result = await db.collection("members").replaceOne(query, data);
    res.send(result);
})

//Called when a note must be deleted
app.post("/api/deleteNote", async (req, res) => {
    console.log("deleteNote received");

    //Finds the note in body of req and deletes it from the database
    const deleteID = (req?.body).deleteNoteID;
    const result = await db.collection("notes").deleteOne({_id: new ObjectId(deleteID)});

    //Error check if the deletion didn't work
    if (result.deletedCount == 0) {
        console.error(`ERROR: Note ${deleteID} was not deleted`);
    }
    res.send(result);
})

app.post("/api/clearNotes", async (req, res) => {
    console.log("clearNotes req received");
    // Remove all items from the collection
    // Didn't use drop because you then can't use Clear All button multiple times
    const result = await db.collection("notes").deleteMany({});
    res.send(result);
})

main().catch(console.error);