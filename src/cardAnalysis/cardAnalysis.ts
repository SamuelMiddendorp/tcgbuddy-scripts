import { hashCard, log } from "../lib/utils";
import { Analysable } from "../model/model";



const rarityDescending = ["Amazing Rare",
    "Classic Collection",
    "Double Rare",
    "Hyper Rare",
    "Illustration Rare",
    "LEGEND",
    "Promo",
    "Radiant Rare",
    "Rare",
    "Rare ACE",
    "Rare BREAK",
    "Rare Holo",
    "Rare Holo EX",
    "Rare Holo GX",
    "Rare Holo LV.X",
    "Rare Holo Star",
    "Rare Holo V",
    "Rare Holo VMAX",
    "Rare Holo VSTAR",
    "Rare Prime",
    "Rare Prism Star",
    "Rare Rainbow",
    "Rare Secret",
    "Rare Shining",
    "Rare Shiny",
    "Rare Shiny GX",
    "Rare Ultra",
    "Special Illustration Rare",
    "Trainer Gallery Rare Holo",
    "Ultra Rare",
    "Rare",
    "Uncommon",
    "Common",
]
export const analyse = (card: Analysable): string[] => {
    return ["DeckSearch"];
}



export const transform = (card: any): string[] => {
    let result = card.rules ?? [];
    result = result.concat(card.abilities ? card.abilities.map(x => x.text) : [])
    result = result.concat(card.attacks ? card.attacks.map(x => x.text) : [])
    return result;
}

interface BaseCardVariationMap {
    [key: string]: any[];
}

export const doAllCardAnalysis = (sets: any[], initState: () => object = () => {return {}}, stateOperation: (card: any, state: object) => object) => {
    let state = {};
    state = initState();
    sets.forEach(set => {
        set.forEach(card => {
            state = stateOperation(card, state);
        })
    });
    return state;
}

const hashExemptionsOnErrataCards = {
    "Great Ball": (card: any): string => { return hashCard({ name: card.name }) },
    "Ultra Ball": (card: any): string => { return hashCard({ name: card.name }) }
}

export const createBaseVersionsOfCards = (cards: any[]) => {
    let map: BaseCardVariationMap = {}
    cards.forEach(set => {
        set.forEach(card => {
            let hash = computeCorrectHash(card);
            if (hash in map) {
                map[hash] = [...map[hash], createCardInfoLight(card)];
            }
            else {
                map[hash] = [createCardInfoLight(card)];
            }
        })

    })
    return map;
}
const computeCorrectHash = (card: any): string => {
    if (card.name in hashExemptionsOnErrataCards) {
        return hashExemptionsOnErrataCards[removeReduntantName(card.name)](card)
    }
    return hashCard({ name: removeReduntantName(card.name), attacks: card.attacks ?? [], rules: card.rules ?? [] })
}
export const createMinimalCardWithReferencesAndWrite = (cards: any, map: any) => {
    let sets = [];
    cards.forEach(set => {
        let setToWrite = [];
        set.forEach(card => {
            let hash = computeCorrectHash(card);
            let cardWithReferences = {
                id: card.id,
                name: card.name,
                image: card.images.small,
                rarity: card.rarity,
                releaseDate: card.set.releaseDate,
                references: map[hash].filter(x => x.id != card.id).sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1)
            }
            setToWrite = [...setToWrite, cardWithReferences];
        })
        sets = [...sets, setToWrite];
    })
    return sets;
}

export const removeReduntantName = (cardName: string): string => {
    return cardName.replace(/\s?\(.*\)/g, "")
}

export const createCardInfoLight = (card: any): any => {
    let cardLight = {
        id: card.id,
        name: card.name,
        rarity: card.rarity,
        releaseDate: card.set.releaseDate,
        image: card.images.small,
    }
    return cardLight
}




