import React from "react";
import type { Card } from "./types";

interface CardStackProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
  onCardHover: (idx: number, idy: number) => void;
  hovered: { idx: number, idy: number };
  stackIdx: number;
  stacked?: boolean;
}

const CardStack: React.FC<CardStackProps> = ({ cards, onCardClick, onCardHover, hovered, stackIdx, stacked = true }) => (
  <div>
    {cards.map((card, idy) => {
      const isFirst = idy === 0;

      return (
        <div
          key={card.customId || card.id || `${stackIdx}_${idy}`}
          className={`cursor-pointer m-1 relative transition-all duration-100 ${stacked && !isFirst ? "-mt-[110%]" : ""} ${hovered.idx === stackIdx && hovered.idy !== -1 && idy === hovered.idy + 1 ? "mt-[-10%]" : ""}`}
          onClick={() => onCardClick(card)}
          onMouseEnter={() => onCardHover(stackIdx, idy)}
          onMouseLeave={() => onCardHover(-1, -1)}
        >
          <img
            src={card.image}
            alt={card.name}
            className={`block ${hovered.idx === stackIdx && hovered.idy === idy ? "z-50" : ""} transition-all duration-200`}
          />
        </div>
      );
    })}
  </div>
);

export default CardStack;