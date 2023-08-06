import axios from "axios";
import { time } from "console";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { PokemonSet } from "./model/model";

// Not sure why this is needed, has something to do with the .env not being in the same folder as app.ts
let userDefinedEnvs = require('dotenv').config().parsed;

interface ApiResponse<T> {
    data: T,
    totalCount: number,
}

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
    await timeout(delay * 50);
    console.log(`Getting cards for set: ${setId}`);
    let res = await doAxiosRequest<ApiResponse<any>>(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&page=1&pageSize=250&orderBy=number`);
    pokemon = pokemon.concat(res.data);
    if (res.totalCount > 250) {
        console.log("Encountered set bigger than 250 cards");
        let res = await doAxiosRequest<ApiResponse<any>>(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&page=2&pageSize=250&orderBy=number`);
        pokemon = pokemon.concat(res.data);
    }
    return pokemon;
}
const ensureFolderExist = (folder: string) => {
    if (!existsSync(folder)) {
        mkdirSync(folder);
    }
}

const getAndWriteAllCardData = async (sets: PokemonSet[]) => {
    // Use plain old for loop to handle awaits correctly
    let data = await Promise.all(sets.map((s,i) => getSetCards(s.id, i)))

    data.forEach(x => {

    })
}
const main = async () => {
    const sets = await getAllSets();
    await getAndWriteAllCardData(sets);
}

const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();






