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


