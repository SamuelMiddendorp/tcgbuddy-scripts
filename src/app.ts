import axios from "axios";
import { time } from "console";
import { TIMEOUT } from "dns";
import { write, writeFile, writeFileSync } from "fs";
import { PokemonSet } from "./model/model";

// Not sure why this is needed, has something to do with the .env not being in the same folder as app.ts
let userDefinedEnvs = require('dotenv').config().parsed;

interface ApiResponse<T> {
    data: T,
    totalCount: number,
}

const getAllSets = async (): Promise<PokemonSet[]> => {
    const { data } = await axios.get<ApiResponse<PokemonSet[]>>("https://api.pokemontcg.io/v2/sets", {
        headers: {
            "X-Api-Key": userDefinedEnvs.API_KEY
        }
    });
    return data.data;
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
    for(var i = 0; i < sets.length; i++){
        let set = sets[i]
        await timeout(100);
        console.log(`Reading and writing set: ${set.name}`)
        var cards = await getSetCards(set.id);
        writeFileSync(`foobar/${set.name}-${set.id}.json`, JSON.stringify(cards));
    }
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
main();






