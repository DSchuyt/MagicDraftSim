import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chosenCardsSlice, boosterSlice, basicLandSlice, type RootState } from './store';
import type { Card } from "./types";
import Inventory from "./Inventory";
import * as Scry from "scryfall-sdk";
import { createCardFromScryfall } from "./CardUtils";

const Draft = ({ handleFinishDraft }: { handleFinishDraft: () => void }) => {
  const dispatch = useDispatch();

  const [currentBoosterSet, setCurrentBoosterSet] = useState<number>(0);
  const [currentPlayerBooster, setCurrentPlayerBooster] = useState<number>(0);

  const boosterSetsState = useSelector((state: RootState) => state.boosterSets)
  const amountOfPlayers = useSelector((state:RootState) => state.playerSlice);
  const chosenCardInventory = useSelector((state: RootState) =>  state.chosenCardsSlice )

  const handleCardPick = (card:Card) => {
    const updatedCard: Card = { ...card, customId: Date.now().toString() }

    //Add card to chosen cards
    dispatch(chosenCardsSlice.actions.addCard({ card: updatedCard }));

    //Remove card from booster pack
    dispatch(boosterSlice.actions.removeCard({ card, boosterSet: currentBoosterSet, boosterPack: currentPlayerBooster }));

    //Simulate a card pick in the other boosters
    simulateCardPick();
  }

  const generateBasicLand = async (name: string, set: string) => {
    try {
      const card = await Scry.Cards.byName(name, set.toUpperCase());
      const newBasicLand: Card = createCardFromScryfall(card);
      dispatch(basicLandSlice.actions.addBasicLand({ card: newBasicLand }));
    } catch (err) {
      console.log("Error in finding land " + name);
    }
  }

  useEffect(() => {
    //Generate lands based on the first set picked - Don't have to wait for this process
    const firstBoosterSet = boosterSetsState.boosterSets[0].setCode;

    ["Plains", "Island", "Swamp", "Mountain", "Forest"].forEach((land) => {
      generateBasicLand(land, firstBoosterSet);
    })

  }, [])

  useEffect(() => {
    //console.log(chosenCardInventory);
  }, [chosenCardInventory])

  useEffect(() => {
    //Check post choice actions
    checkPackStates();
  }, [boosterSetsState]);

  const simulateCardPick = () => {
    dispatch(boosterSlice.actions.removeRandomCard({
      boosterSet: currentBoosterSet,
      currentActivePack: currentPlayerBooster
    }));
  }

  const checkPackStates = () => {
    if(boosterSetsState.boosterSets[currentBoosterSet].packs[currentPlayerBooster].cards.length === 0){
        //Active boosterpack is empty, load next booster set
        setCurrentPlayerBooster(0);

        if(currentBoosterSet < 2){
            //There are still boosters left
            setCurrentBoosterSet(currentBoosterSet + 1);
        }
        else {
            //There are no more boosters left, finish draft
            handleFinishDraft();
        }
    }
    else {
        //Active booster pack is not empty, load the next one
        currentPlayerBooster === amountOfPlayers.value - 1 ? setCurrentPlayerBooster(0) : setCurrentPlayerBooster(currentPlayerBooster + 1);
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto m-5">
      <h1 className="text-2xl font-bold text-white mb-4">Drafting Booster Pack Set {currentBoosterSet + 1}</h1>
      <div className="grid grid-cols-5 gap-5 bg-gray-500 rounded-lg shadow-lg p-4">
        {currentBoosterSet >= 2 && boosterSetsState.boosterSets[currentBoosterSet].packs[currentPlayerBooster].cards.length === 0
            ? <div>Draft cards are empty</div> 
            : boosterSetsState.boosterSets[currentBoosterSet].packs[currentPlayerBooster].cards.map((card, idx) =>
                <div onClick={() => handleCardPick(card)} key={card.customId + card.id} className="inline cursor-pointer"><img src={card.image} alt={card.name} className={`w-full max-w-full h-auto rounded-md border-4 transition-transform duration-100 hover:scale-[1.5] hover:shadow-2x1 hover:-translate-y-2
                    ${card.rarity === "common" ? "border-gray-800" 
                    : card.rarity === "uncommon" ? "border-[#E0E0E0]" 
                    : card.rarity === "rare" || card.rarity === "mythic" ? "border-[#FFA500]" : "" }`} />
                </div>
            )
        }
      </div>
      <Inventory />
    </div>
  );
};

export default Draft;