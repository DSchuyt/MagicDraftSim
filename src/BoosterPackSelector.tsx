import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { populateBoosterAsync } from "./store";
import type { AppDispatch } from "./store";
import type { RootState } from "./store";

interface BoosterPackSelectorProps {
  index: number
  setList: any[]
}

const BoosterPackSelector = ({ index, setList }: BoosterPackSelectorProps) => {
  const [chosenSet, setChosenSet] = useState<any>({});
  const [setSelectValue, setSetSelectValue] = useState<string>('');
  
  const players = useSelector((state: RootState) => state.playerSlice.value);
  const setSelect = useRef<HTMLSelectElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const createBoosterSetup = () => {
    if(setSelectValue){
      const chooseSet = setList.find(set => set.code === setSelectValue);

      if(chooseSet){
        setChosenSet(chooseSet);
        dispatch(populateBoosterAsync({ index, setCode: setSelectValue, playerAmount: players }));
      }
    }
  }
  
  const onChange = (set: string) => {
    setSetSelectValue(set);
  }

  useEffect(() => {
    createBoosterSetup();
  }, [players, setSelectValue]);

  return (
    <div className="bg-gray-500 rounded-lg shadow-lg px-4 py-3 h-[500px] flex flex-col justify-start">
      <h2 className="text-xl font-bold mb-4">Booster Pack {index + 1}</h2>
      <div className="set-box flex-1 flex flex-col justify-center items-center">
        <select value={chosenSet.code || ""} className="px-3 py-2 border rounded text-gray-900 w-full" ref={setSelect} onChange={(e) => onChange(e.target.value)}>
          <option key="default" value="" disabled hidden>Choose a set</option>
          {setList.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="p-4 w-48 h-48 mx-auto">
          {chosenSet && Object.keys(chosenSet).length ?
            <img src={chosenSet.icon_svg_uri} /> 
          : "" }
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoosterPackSelector;