export interface Card {
  _id: string;
  name: string;
  supertype: string;
  subtype?: (string)[] | null;
  hp: string;
  types?: (string)[] | null;
  rules?: null;
  evolvesTo?: null;
  attacks?: (AttacksEntity)[] | null;
  images: Images;
  functions?: (string)[] | null;
}
export interface AttacksEntity {
  name: string;
  cost?: (string)[] | null;
  convertedEnergyCost: number;
  damage: string;
  text: string;
}
export interface Images {
  small: string;
  large: string;
}


export interface PokemonSet{
  id: string,
  name: string,
  total: number
}