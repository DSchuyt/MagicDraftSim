import type { Card } from "./types";

export function createCardFromScryfall(cardData: any): Card {  
  return {
    id: cardData.id || "",
    name: cardData.name,
    image: cardData.image_uris?.normal ?? "",
    mana_cost: cardData.mana_cost || "",
    colors: cardData.colors || [],
    rarity: cardData.rarity || "",
    set_name: cardData.set_name || "",
    set_code: cardData.set || "",
    cmc: cardData.cmc,
    type: cardData.type_line,
    customId: ""
  };
}