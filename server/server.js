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

//Fetching of data from database
app.get("/api/getMember", async (req, res) => {
    const data = (req?.body);
    console.log(data);
    const result = await db.collection("members").find().toArray();
    res.json(result);
});


app.post("/api/addMember", async (req, res) => {
    console.log("addMember req received");

    //Finds the note in body of req and adds it to the database
    const data = req?.body;
    const result = await db.collection("members").insertOne(data);
    res.send(result);
});

app.post("/api/deleteMember", async (req, res) => {
    console.log("deleteMember received");

    //Finds the note in body of req and deletes it from the database
    const deleteID = (req?.body).deleteMemberID;
    const result = await db.collection("members").deleteOne({_id: new ObjectId(deleteID)});

    //Error check if the deletion didn't work
    if (result.deletedCount == 0) {
        console.error(`ERROR: Member ${deleteID} was not deleted`);
    }
    res.send(result);
});

// update
app.post("/api/updateMember", async (req, res) => {
    console.log("updateMember received");
    const data = req?.body;
    const id = data._id;
    delete data._id;
    const result = await db.collection("members").updateOne({_id: new ObjectId(id)}, {$set: data});
    res.send(result);
});

//Called when a council member must be replaced
app.post("/api/updateMember", async (req, res) => {
    console.log("replaceMember req received");

    //Finds the note in body of req and adds it to the database
    //const data = req?.body;
    const query={"districtNum": 8}

    //Example
    /*
    const data ={
        districtNum:8,
        name:"Diana Ayala",
        borough: ["Manhattan", "Bronx"],
        party:"Democrat",
        districts:[
            "Mott Haven-Port Morris", "Melrose", "Concourse-Concourse Village", "Upper East Side-Carnegie Hill", "Upper East Side-Yorkville", "East Harlem (South)", "East Harlem (North)", "Randall's Island"
        ],
        email: "District8@council.nyc.gov"};
    */
    const result = await db.collection("members").replaceOne(query, data);
    res.send(result);
})


/* Users */

app.get("/api/getUser", async (req, res) => {
    const data = await db.collection("users").find().toArray();
    res.json(data);
});


//Fetch legislative members database
app.get("/api/getMembers", async (req, res) => {
    const data = await fetch(
        `https://webapi.legistar.com/v1/nyc/Bodies`
    );
    const result = await data.json();


    console.log("FETCHED!");
    console.log(result);
    res.json(data);
})


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
    const data = req?.body;

    /*
    const data ={
        districtNum:12,
        name:"Kevin C. Riley",
        borough: ["Bronx"],
        party:"Democrat",
        districts:[
            "Co-op City", "Pelham Gardens", "Allerton", "Williamsbridge-Olinville", "Eastchester-Edenwald-Baychester", "Wakefield-Woodlawn", "Pelham Bay Park"
        ],
        email: "District12@council.nyc.gov"};
    */
    const result = await db.collection("members").insertOne(data);
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



main().catch(console.error);