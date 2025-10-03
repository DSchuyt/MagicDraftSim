import { useState, useEffect, useMemo } from "react";
import { type RootState } from "./store";
import { useSelector } from "react-redux";
import type { Card } from "./types";
import CardStack from "./CardStack";

const DeckCreator: React.FC = () => {
  const chosenCardInventory = useSelector((state: RootState) =>  state.chosenCardsSlice);

  const [cardsInDeck, setCardsInDeck] = useState<Card[]>(chosenCardInventory);
  const [cardsNotInDeck, setCardsNotInDeck] = useState<Card[]>([]);
  const [isHovered, setHoveredCard] = useState<{ idx: number, idy: number }>({ idx: -1, idy: -1 });
  const sideboardStackID = 100; //Needs to be large number

  const basicLandState = useSelector((state: RootState) => state.basicLandSlice);

  const moveCardFromDeckToSideboard = (card: Card) => {
    setCardsInDeck(cards => cards.filter(c => c.customId !== card.customId));
    if(!["Plains", "Island", "Swamp", "Mountain", "Forest"].includes(card.name)){
      setCardsNotInDeck(cardsNotInDeck => [...cardsNotInDeck, card]);
    }
  };

  const moveCardFromSideboardToDeck = (card: Card) => {
    setCardsNotInDeck(cards => cards.filter(c => c.customId !== card.customId));
    setCardsInDeck(cardsInDeck => [...cardsInDeck, card]);
  };

  const addLandToDeck = (card: Card) => {
    const updatedCard: Card = { ...card, customId: Date.now().toString() }
    setCardsInDeck(cardsInDeck => [...cardsInDeck, updatedCard]);
  }

  //Memos for Sideboard and cmcValues
  const sideBoardCards = useMemo(() =>
    cardsNotInDeck.sort((a, b) => {
      const cmcA = a.cmc;
      const cmcB = b.cmc;

      if (cmcA !== cmcB) {
        return cmcA - cmcB;
      }

      return a.name.localeCompare(b.name);
    })
  , [cardsNotInDeck])

  const cmcValues = useMemo(() => 
    Array.from(new Set(cardsInDeck.map(card => card.cmc))).sort((a, b) => a - b)
  , [cardsInDeck]);

  const mapCardsPerCMC = () => {
    return (
      <div>
        <div className="hidden grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10" />
        <div className={`grid grid-cols-${cmcValues.length}`}>
          {cmcValues.map((cmc, idx) => {
            const cards = cardsInDeck.filter((c) => c.cmc === cmc).sort((a, b) => a.name.localeCompare(b.name));
            
            return (
              <div key={idx} className="relative">
                <div>
                  <div className="mx-auto text-white w-[20px] h-[20px] text-center bg-gray-200 rounded-full justify-center items-center font-bold flex">
                    <span className="text-gray-800 -mt-[2px]">{cmc}</span>
                  </div>
                  <div className="block w-100 text-center text-white">
                    x {cards.length}
                  </div>
                </div>
                <CardStack cards={cards} onCardClick={moveCardFromDeckToSideboard} onCardHover={(idx, idy) => setHoveredCard({ idx, idy })} hovered={isHovered} stackIdx={idx} stacked={true} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-w-[800px] max-w-[1800px] mx-auto">
      <div className="p-4 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold text-white mb-4 block w-100">Deck Creator</h1>
        <div className="text-white bg-neutral-800 mb-5 rounded-lg border-2 p-5">
          <p>Add Basic Land</p>
          <div>
            {basicLandState.map((land: Card, idx: number) => (
              <div onClick={() => addLandToDeck(land)} className="inline-block mr-2 cursor-pointer w-16 text-center text-sm" key={idx}>
                <img src={land.image} alt={land.name} />
                {land.name}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-x-6 p-5 bg-neutral-800 rounded-lg border-2">
          <div className="w-5/6">
            <h2 className="text-white text-center mb-6 border-b-2 pb-2">
              Cards in Deck - <span className={cardsInDeck.length < 40 ? "text-red-500" : "text-green-500"}>{cardsInDeck.length}</span> / 40
            </h2>
            {mapCardsPerCMC()}
          </div>
          <div className="w-1/6">
            <h2 className="text-white text-center mb-4 border-b-2 pb-2">Cards in Sideboard</h2>
            <CardStack hovered={isHovered} stackIdx={100} stacked={true} cards={sideBoardCards}
              onCardClick={moveCardFromSideboardToDeck}
              onCardHover={(idx, idy) => setHoveredCard({ idx: sideboardStackID, idy })} //Arbitrarily high number 100
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckCreator;