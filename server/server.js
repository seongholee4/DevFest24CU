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
app.get("/api", async (req, res) =>{
    const data = await db.collection("users").find().toArray();
    res.json(data);
});


//Called when a user must be added
app.post("/api/addUser", async (req, res) => {
    console.log("addUser req received");

    //Finds the note in body of req and adds it to the database
    //const data = req?.body;
    const data = {ssn: "1234567890", name: "Bob Jones", zipCode: "12345", phoneNumber: "1234567890", preferences:["environment", "politics"], ccMember:"Christopher Marte"};
    const result = await db.collection("users").insertOne(data);
    res.send(result);
})

//Called when a user must be added
app.post("/api/addMember", async (req, res) => {
    console.log("addMember req received");

    //Finds the note in body of req and adds it to the database
    //const data = req?.body;
    const data = {ssn: "1234567890", name: "Bob Jones", zipCode: "12345", phoneNumber: "1234567890", preferences:["environment", "politics"], ccMember:"Christopher Marte"};
    const result = await db.collection("users").insertOne(data);
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