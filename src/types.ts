export interface Set {
  setCode: string;
  name: string;
  icon_svg_uri: string;
}

export interface Card {
  id: string;
  name: string;
  image: string;
  mana_cost: string;
  colors: string[];
  rarity: string;
  set_name: string;
  set_code: string;
  cmc: number;
  customId: string;
  type: string;
}

export interface BoosterPack {
  cards: Card[];
  setCode: string;
}

export interface BoosterPackSet {
    setCode: string;
    packs: BoosterPack[];
}