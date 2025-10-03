import { useDispatch, useSelector } from 'react-redux'
import * as Scry from "scryfall-sdk";
import { useEffect, useState, useMemo } from 'react';

import BoosterPackSelector from './BoosterPackSelector';
import Draft from './Draft';
import DeckCreator from './DeckCreator';

import { playerSlice } from './store';
import type { RootState } from './store';

function App() {
  const dispatch = useDispatch()

  const [allSets, setAllSets] = useState<any[]>([]);
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [finishedDrafting, setFinishedDrafting] = useState<boolean>(false);

  const boosterSetsState = useSelector((state: RootState) => state.boosterSets)

  const hasBoostersSelected = useMemo(() => {
    return boosterSetsState.boosterSets.every(set => set.packs.length > 0);
  }, [boosterSetsState]);

  const handleDraftStart = () => {
    if(hasBoostersSelected) {
      setIsDrafting(!isDrafting)
    }
  }

  const handleFinishDraft = () => {
    setIsDrafting(false);
    setFinishedDrafting(true);
  }

  useEffect(() => {
    async function fetchAllSets() {
      const sets = await Scry.Sets.all();

      const filteredSets = sets.filter(s => { return s.set_type === "expansion" && Number(s.card_count) >= 150 && !s.digital });

      setAllSets(filteredSets);
    }

    fetchAllSets();
  }, []);

  return (
    <div>
      { 
        !isDrafting && !finishedDrafting ? (
          <div className="min-h-screen flex items-center text-gray-50 flex-col space-y-10">
            <div className="grid grid-cols-3 gap-10 top-0">
              {[0, 1, 2].map(idx => (
                <BoosterPackSelector key={idx} index={idx} setList={allSets} />
              ))}
            </div>
            <div className="text-white space-x-10">
              <select className="text-white bg-gray-900 p-3 border rounded" aria-label="Select number of players" onChange={e => dispatch(playerSlice.actions.setPlayers(Number(e.target.value)))}>
                {[2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>{n} Players</option>
                ))}
              </select>
              <button aria-label="Start Draft" disabled={!hasBoostersSelected} className={!hasBoostersSelected ? "text-gray-700 cursor-default" : ""} onClick={() => handleDraftStart()}>Start Draft</button>
            </div>
          </div>
        ) : isDrafting && !finishedDrafting ? (
          <div className="">
            <Draft handleFinishDraft={handleFinishDraft} />
          </div>
        ) : !isDrafting && finishedDrafting ? (
          <div>
            <DeckCreator />
          </div>
        ) : null
      }
    </div>
  )
}

export default App