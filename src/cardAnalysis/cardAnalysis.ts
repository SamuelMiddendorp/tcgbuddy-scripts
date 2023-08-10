import { hashCard, log } from "../lib/utils";
import { Analysable } from "../model/model";




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

            let hash = hashCard({name: card.name, attacks: card.attacks ?? [], rules: card.rules ?? []}); 
            if(hash in map){
                map[hash] = [...map[hash], createCardInfoLight(card)];
            }
            else{
                log(`Found new card to add to map ${card.name}`)
                map[hash] = [createCardInfoLight(card)];
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




