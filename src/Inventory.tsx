import { useSelector } from "react-redux";
import type { RootState } from "./store";
import React from "react";
import type { Card } from "./types";

const Inventory: React.FC = () => {
  const chosenCards = useSelector((state: RootState) => state.chosenCardsSlice);
  const stackOffset = "-mt-[200px]";

  const groupedCards = chosenCards.reduce<Record<string, Card[]>>((acc, card) => {
    acc[card.name] = acc[card.name] ? [...acc[card.name], card] : [card];
    return acc;
  }, {});

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Chosen cards so far</h1>
      <div className="grid grid-cols-6 gap-2">
        {Object.entries(groupedCards).sort((a, b) => { 
          const cmcA = a[1][0].cmc;
          const cmcB = b[1][0].cmc;
          
          if(cmcA !== cmcB){
            return cmcA - cmcB;
          }
          return a[0].localeCompare(b[0]);
        })
        .map(([name, cards]) => (
          <div key={name}>
            {cards.map((c, idx) => {
              return <img key={c.id} src={c.image || ""} alt={c.name} className={idx > 0 ? stackOffset : ""} />
            })}
            <div>{name} x{cards.length}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
