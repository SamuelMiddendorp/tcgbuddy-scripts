import { MongoClient } from "mongodb";
import { enhance, getCurrentlyAvailableData } from "./lib/utils";

let url = "mongodb://127.0.0.1:27017/TCGBUDDY"
let mongoClient = new MongoClient(url);
let db = mongoClient.db();

let collection = db.collection("Cards22")
const logConnection = async () => {
    const cards = await getCurrentlyAvailableData();
    console.log(cards.length);
    console.log(cards[0].length)
    await collection.insertMany(cards[0].map(x => enhance(x, (y => {
        y._id = y.id;
        return y;
    }))));
}
logConnection().then(x => console.log("Succes!"))


