import axios from "axios";
import { writeFileSync } from "fs";
import { createBaseVersionsOfCards } from "./cardAnalysis/cardAnalysis";
import { ensureFolderExist, getCurrentlyAvailableData, getFormattedDateString, log, timeout, writeData } from "./lib/utils";
import { PokemonSet, ApiResponse } from "./model/model";
import { writeCurrentlyAvailableCardsToDb } from "./mongo";

// Not sure why this is needed, has something to do with the .env not being in the same folder as app.ts
let userDefinedEnvs = require('dotenv').config().parsed;

const getAllSets = async (): Promise<PokemonSet[]> => {
    const res = await doAxiosRequest<ApiResponse<PokemonSet[]>>(
        "https://api.pokemontcg.io/v2/sets?orderBy=releaseDate"
    )
    return res.data;
}
const doAxiosRequest = async <T,>(url: string): Promise<T> => {
    try {
        const res = await axios.get<T>(url, {
            headers: {
                "X-Api-Key": userDefinedEnvs.API_KEY
            }
        });
        return res.data;
    }
    catch (error) {
        // We simply log an error and FAIL
        console.log(error);
        throw new Error(`Error doing request: ${url}`);
    }
}
const getSetCards = async (setId: string, delay: number): Promise<any> => {
    let pokemon = [];
    // Add delay else 404's will come back because to many request (I assume)
    await timeout(delay * 100);
    log(`Getting cards for set: ${setId}`);
    let res = await doAxiosRequest<ApiResponse<any>>(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&page=1&pageSize=250&orderBy=number`);
    pokemon = pokemon.concat(res.data);
    if (res.totalCount > 250) {
        log("Encountered set bigger than 250 cards");
        let res = await doAxiosRequest<ApiResponse<any>>(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&page=2&pageSize=250&orderBy=number`);
        pokemon = pokemon.concat(res.data);
    }
    return pokemon;
}

const getAllCardData = async (sets: PokemonSet[]): Promise<any[]> => {
    // Use promise all with delay i 
    let data = await Promise.all(sets.map((s, i) => getSetCards(s.id, i)))
    return data;
}

const writeAllCardData = async (allCardData: any[]) => {
    let targetFolder = `sets-${getFormattedDateString()}`;
    log(`Trying to write to folder: ${targetFolder}`)
    ensureFolderExist(targetFolder);
    await Promise.all(allCardData.map(data => {
        // Use set object in card data to define file path
        writeData(`${targetFolder + "/" + data[0].set.id + ".json"}`, data)
    }))
}
const actionMap = {export : () => runExport(),
                   analysis: () => runAnalysis()}

const main = async () => {
    let args = parseArgs();
    for(var i = 0; i < args.length; i++){
        await actionMap[args[i]]();
    }
}
const parseArgs = (): string[] => {
    return process.argv.slice(2);
}
const runAnalysis = async () => {
    let cards = await getCurrentlyAvailableData();
    let cardMaps = createBaseVersionsOfCards(cards);
    writeFileSync("out.json", JSON.stringify(cardMaps));
}
const runExport = async () => {
    const sets = await getAllSets();
    const allSetCards = await getAllCardData(sets);
    await writeAllCardData(allSetCards);
    await writeCurrentlyAvailableCardsToDb();
}




main();


