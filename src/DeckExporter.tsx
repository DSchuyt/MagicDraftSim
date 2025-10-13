import type { Card } from './types';
import { useState } from "react";
import Modal from './Modal';

interface DeckExporterProps {
  cardsInDeck: Card[];
  cardsInSideboard: Card[];
}

const DeckExporter: React.FC<DeckExporterProps> = ({ cardsInDeck, cardsInSideboard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExport = () => {
    setIsModalOpen(true);
  }

  return (
    <div className="p-4">
      <button onClick={handleExport}>Export</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div>
          <h3>Deck Export</h3>
          <p>Deck cards: {cardsInDeck.length}</p>
          <p>Sideboard cards: {cardsInSideboard.length}</p>
        </div>
      </Modal>
    </div>
  );
};

export default DeckExporter;