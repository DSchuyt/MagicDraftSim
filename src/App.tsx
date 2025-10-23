import { useDispatch, useSelector } from 'react-redux'
import * as Scry from "scryfall-sdk";
import { useEffect, useState, useMemo } from 'react';

import BoosterPackSelector from './Components/BoosterPackSelector';
import Draft from './Components/Draft';
import DeckCreator from './Components/DeckCreator';

import { playerSlice } from './store';
import type { RootState } from './store';

function App() {
  const dispatch = useDispatch();

  const playerValues = [2, 3, 4, 5, 6, 7, 8];
  const boosterValues = [0, 1, 2];

  const [allSets, setAllSets] = useState<Scry.Set[]>([]);
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

  //Call all sets upon load for usage in boosterSelector
  useEffect(() => {
    async function fetchAllSets() {
      const sets = await Scry.Sets.all();

      const filteredSets = sets.filter(s => { return s.set_type === "expansion" && Number(s.card_count) >= 120 && !s.digital });

      setAllSets(filteredSets);
    }

    fetchAllSets();
  }, []);

  return (
    <div className="min-h-screen bg-radial from-gray-600 via-gray-700 to-gray-800">
      { 
        !isDrafting && !finishedDrafting ? (
          <div className="flex items-center text-gray-50 flex-col space-y-10">
            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-10 top-0 mt-[30px]">
              {boosterValues.map(idx => (
                <BoosterPackSelector key={idx} index={idx} setList={allSets} />
              ))}
            </div>
            <div className="text-white space-x-10">
              <select defaultValue={4} className="text-white bg-gray-900 p-3 border rounded" aria-label="Select number of players" onChange={e => dispatch(playerSlice.actions.setPlayers(Number(e.target.value)))}>
                {playerValues.map(n => (
                  <option key={n} value={n}>{n} Players</option>
                ))}
              </select>
              <button aria-label="Start Draft" disabled={!hasBoostersSelected} className={`clickButton ${!hasBoostersSelected ? "text-gray-700 !bg-gray-500 cursor-default" : ""}`} onClick={() => handleDraftStart()}>Start Draft</button>
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