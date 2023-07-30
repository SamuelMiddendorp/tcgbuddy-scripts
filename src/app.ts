import axios from "axios";
import { write, writeFileSync } from "fs";
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
    const { data } = await axios.get<ApiResponse<any>>(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`, {
        headers: {
            "X-Api-Key": userDefinedEnvs.API_KEY
        }
    });
    pokemon = pokemon.concat(data.data);
    if (data.totalCount > 250) {
        const { data } = await axios.get<ApiResponse<any>>(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&page=2`, {
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

    sets.forEach(async x => {

        let cards = await getSetCards(x.id);
        writeFileSync(`${x.name}.json`, JSON.stringify(cards));
    })
}

main();






