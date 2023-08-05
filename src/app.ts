import axios from "axios";
import { writeFile, writeFileSync } from "fs";
import { PokemonSet } from "./model/model";

// Not sure why this is needed, has something to do with the .env not being in the same folder as app.ts
let userDefinedEnvs = require('dotenv').config().parsed;

interface ApiResponse<T> {
    data: T,
    totalCount: number,
}

const getAllSets = async (): Promise<PokemonSet[]> => {

    const res = await doAxiosRequest<ApiResponse<PokemonSet[]>>(
        "https://api.pokemontcg.io/v2/sets222"
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
        console.log(Object.keys(error), error.message);
        throw new Error("Error doing request");
    }
}
const getSetCards = async (setId: string): Promise<any> => {
    let pokemon = [];
    const { data } = await axios.get<ApiResponse<any>>(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&page=1&pageSize=250&orderBy=number`, {
        headers: {
            "X-Api-Key": userDefinedEnvs.API_KEY
        }
    });
    pokemon = pokemon.concat(data.data);
    if (data.totalCount > 250) {
        const { data } = await axios.get<ApiResponse<any>>(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&page=2&pageSize=250&orderBy=number`, {
            headers: {
                "X-Api-Key": userDefinedEnvs.API_KEY
            }
        });
        pokemon = pokemon.concat(data.data);

    }
    return pokemon;
}
const main = async () => {
    const sets = await getAllSets();
    writeFile("sets.json", JSON.stringify(sets), (x => x));
    return;
    // for (var i = 0; i < sets.length; i++) {
    //     let set = sets[i]
    //     await timeout(100);
    //     console.log(`Reading and writing set: ${set.name}`)
    //     var cards = await getSetCards(set.id);
    //     writeFileSync(`sets/${set.name}-${set.id}.json`, JSON.stringify(cards));
    // }
}
const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();






