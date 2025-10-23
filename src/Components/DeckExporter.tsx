import type { Card } from '../types';
import { useState, useRef } from "react";
import Modal from '../Utils/Modal';

interface DeckExporterProps {
  cardsInDeck: Card[];
  cardsInSideboard: Card[];
}

const DeckExporter: React.FC<DeckExporterProps> = ({ cardsInDeck, cardsInSideboard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const outputAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleExport = () => {
    setIsModalOpen(true);
  }

  const printExportFor = (tool: string) => {
    let deckList = "";

    switch (tool) {
      case "Archidekt":
        //Use formatting rules for Archidekt
        
        //Mainboard
        cardsInDeck.forEach((card) => {
          deckList += "1x " + card.name + " (" + card.set_code + ")";
            deckList += "\n";
        });

        //Maybeboard
        cardsInSideboard.forEach((card, idx) => {
          deckList += "1x " + card.name + " (" + card.set_code + ") " + "[Maybeboard{noDeck}{noPrice}]";
          if(idx !== cardsInDeck.length - 1){
            deckList += "\n";
          }
        });

        break;
      default:
        console.log("Unknown export destination");
    }

    if(deckList !== "" && outputAreaRef.current){
      outputAreaRef.current.value = deckList;
      navigator.clipboard.writeText(outputAreaRef.current.value);
    }
  }

  return (
    <div className="p-4">
      <button className="clickButton" onClick={handleExport}>Export</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div>
          <h1>Deck Export</h1>
          <p>Deck cards: {cardsInDeck.length}</p>
          <p>Sideboard cards: {cardsInSideboard.length}</p>
        </div>
        <div className="border mt-3 mb-2"></div>
        <div>
          <h2>Export for:</h2>
          <button onClick={() => printExportFor("Archidekt")} className="clickButton">Archidekt</button>
        </div>
        <textarea ref={outputAreaRef} readOnly placeholder="Cards to export..." className="p-2 mt-4 resize-none border rounded w-full text-gray-900 h-48" />
      </Modal>
    </div>
  );
};

export default DeckExporter;