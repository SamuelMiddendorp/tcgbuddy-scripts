import { MongoClient } from "mongodb";
import { enhance, getCurrentlyAvailableData, log } from "./lib/utils";

let url = "mongodb://127.0.0.1:27017/TCGBUDDY"
let mongoClient = new MongoClient(url);
let db = mongoClient.db();

let collection = db.collection("Cards33")
export const writeCurrentlyAvailableCardsToDb = async () => {
    log("inserting data into mongodb");
    const cards = await getCurrentlyAvailableData();
    for (var i = 0; i < cards.length; i++) {
        let set = cards[i];
        await collection.insertMany(set.map(x => enhance(x, (y => {
            y._id = y.id;
            return y;
        }))));
    }
    mongoClient.close();
    return;
}


