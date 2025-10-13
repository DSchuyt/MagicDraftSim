import * as Scry from "scryfall-sdk";
 
import type { BoosterPack, BoosterPackSet, Card } from "./types";
import { createCardFromScryfall } from "./CardUtils";

const getRandomItems = (cards: Card[], amount: number): Card[] => {
    const randomItems: Card[] = cards.slice();

    return randomItems.sort(() => Math.random() - 0.5).slice(0, amount);
}

export async function GenerateBooster(setCode: string, playerAmount: number): Promise<BoosterPack[]> {
    return new Promise((resolve, reject) => {
        const allCardsInSet: Card[] = [];

        const commonCardsAmount = 10;
        const uncommonCardsAmount = 3;
        const rareMythicCardsAmount = 1;

        Scry.Cards.search("e:" + setCode.toLowerCase() + " is:booster -t:basic").on("data", card => {
            allCardsInSet.push(createCardFromScryfall(card));
        }).on("end", () => {
            const packs: BoosterPack[] = [];

            for(let i = 0; i < Number(playerAmount); i++){
                const selectedCards: Card[] = [];

                const allCommonCards: Card[] = allCardsInSet.filter((c) => { return c.rarity === "common"; })
                const allUncommonCards: Card[]  = allCardsInSet.filter((c) => { return c.rarity === "uncommon"; })
                const allRareMythicCards: Card[]  = allCardsInSet.filter((c) => { return c.rarity === "rare" || c.rarity === "mythic"; })

                selectedCards.push(...getRandomItems(allCommonCards, commonCardsAmount));
                selectedCards.push(...getRandomItems(allUncommonCards, uncommonCardsAmount));
                selectedCards.push(...getRandomItems(allRareMythicCards, rareMythicCardsAmount));

                packs.push({ setCode, cards: selectedCards });
            }

            resolve(packs);

        }).on("error", err => {
            reject(err);
        });
    });
}