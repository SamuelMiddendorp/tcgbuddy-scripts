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
            let hash = hashCard({name: removeReduntantName(card.name), attacks: card.attacks ?? [], rules: card.rules ?? []}); 
            if(hash in map){
                map[hash] = [...map[hash], createCardInfoLight(card)];
            }
            else{
                map[hash] = [createCardInfoLight(card)];
            }
        })

    })
    return map;
}
export const removeReduntantName = (cardName: string) : string => {
    return cardName.replace(/\s\(.*\)/g, "") 

}
export const createCardInfoLight = (card: any) : any => {
    try{
        let cardLight = {
        name: card.name,
        id: card.id,
        artist: card.artist,
        cost: card.tcgplayer.prices.normal.low
    }
    return cardLight
    }
    catch{
        let cardLight = {
        name: card.name,
        id: card.id,
        artist: card.artist,
        cost: 0.0
    }
    return cardLight
    }
}




