import { createHash } from "crypto";
import { log } from "../lib/utils";
import { Analysable, Card } from "../model/model";




export const analyse = (card: Analysable) : string[] => {
    return ["DeckSearch"];
}



export const transform = (card: any) : string[] => {
    let result = card.rules ?? [];
    result = result.concat(card.abilities ? card.abilities.map(x => x.text) : [])
    result = result.concat(card.attacks ? card.attacks.map(x => x.text): [])
    return result;
}
interface CardInfo{
    name: string,
    hash: string,
}
interface BaseCardVariationMap {
    [key: string]: any[];
}

export const createBaseVersionsOfCards = (cards: any[]) => {
    let map: BaseCardVariationMap = {}
    cards.forEach(set => {
        set.forEach(card => {
            if (card.supertype != "Trainer"){
                // Early return on non trainers
                return
            }
            let hash = createHash("sha256");
            let cardTextHash = hash.update(JSON.stringify(card.rules)).digest("base64");
            if(cardTextHash in map){
                map[cardTextHash] = [...map[cardTextHash], createCardInfoLight(card)];
            }
            else{
                log(`Found new card to add to map ${card.name}`)
                map[cardTextHash] = [createCardInfoLight(card)];
            }
        })

    })
    return map;
}
export const createCardInfoLight = (card: any) : any => {
    return{
        name: card.name,
        id: card.id,
        artist: card.artist
    }
}




