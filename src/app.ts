import axios from "axios";
import { PokemonSet } from "./model/model";

// Not sure why this is needed, has something to do with the .env not being in the same folder as app.ts
let userDefinedEnvs = require('dotenv').config().parsed;

interface ApiResponse<T>{
    data: T;
}

const getAllSets = async () : Promise<PokemonSet[]> => { 
    const { data } = await axios.get<ApiResponse<PokemonSet[]>>("https://api.pokemontcg.io/v2/sets", {
        headers:{
            "X-Api-Key": userDefinedEnvs.API_KEY
        }
    });
    return data.data;
}
const main = async () => {

    const sets = await getAllSets();
    sets.forEach(set => console.log(`set: ${set.name} with id: ${set.id}`))
}

main();






