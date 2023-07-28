import { MongoClient } from "mongodb";

let url = "mongodb://127.0.0.1:27017/TCGBUDDY"
let mongoClient = new MongoClient(url);
let db = mongoClient.db();

let collection = db.collection("Cards")

const logConnection = async () => {
    const results = collection.find().limit(100);
    const res = await results.toArray();
    console.log(res);
    mongoClient.close();
    return;
}
logConnection().then(x => console.log("Succes!"))


