import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

import type { BoosterPackSet } from './types';
import { GenerateBooster } from './GenerateBooster';
import type { Card } from './types';

interface multipleBoosterSets {
    boosterSets: [BoosterPackSet, BoosterPackSet, BoosterPackSet];
}

const initialBoosterSetState: BoosterPackSet = {
    setCode: '',
    packs: []
}

const initialState: multipleBoosterSets = {
    boosterSets: [initialBoosterSetState, initialBoosterSetState, initialBoosterSetState]
}

export const populateBoosterAsync = createAsyncThunk('boosters/populateBoosterAsync', async({ index, setCode, playerAmount }: { index: number; setCode: string, playerAmount: number }) => {
    const boosterList = await GenerateBooster(setCode, playerAmount);

    return { index, setCode, boosterList }
});

export const boosterSlice = createSlice({
    name: 'boosterSets',
    initialState,
    reducers: {
        removeCard: (state, action: PayloadAction<{ card: Card, boosterSet: number, boosterPack: number }>) => {
            const cards = state.boosterSets[action.payload.boosterSet].packs[action.payload.boosterPack].cards;
            const index = cards.findIndex((c) => { return c.name === action.payload.card.name })
            if(index !== -1){
                cards.splice(index, 1);
            }
        },
        removeRandomCard: (state, action: PayloadAction<{ currentActivePack: number, boosterSet: number }>) => {
            const packs = state.boosterSets[action.payload.boosterSet].packs;
            packs.forEach((pack, idx) => {
                if(idx !== action.payload.currentActivePack){
                    const randomIdx = Math.floor(Math.random() * pack.cards.length);
                    pack.cards.splice(randomIdx, 1);
                }
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(populateBoosterAsync.pending, (state, action) => {
                const { index } = action.meta.arg;
                //Set possible loading state
                //state.boosterSets[index].isLoading = true;
            })
            .addCase(populateBoosterAsync.fulfilled, (state, action) => {
                const { index, setCode, boosterList } = action.payload;

                state.boosterSets[index].packs = boosterList;
                state.boosterSets[index].setCode = setCode;
            })
            .addCase(populateBoosterAsync.rejected, (state, action) => {
                const { index } = action.meta.arg;
                console.log("Booster " + index + " failed to load");
            })
    }
});

export const playerSlice = createSlice({
    name: 'players',
    initialState: { value: 2 },
    reducers: {
        setPlayers: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const chosenCardsSlice = createSlice({
    name: 'chosenCards',
    initialState: [] as Card[],
    reducers: {
        addCard: (state, action: PayloadAction<{ card: Card }>) => {
            state.push(action.payload.card);
        }
    }
});

export const basicLandSlice = createSlice({
    name: 'basicLands',
    initialState: [] as Card[],
    reducers: {
        addBasicLand: (state, action: PayloadAction<{ card: Card }>) => {
            if(!state.some(card => card.name === action.payload.card.name)){
                state.push(action.payload.card);
            }
        }
    }
})

export const store = configureStore({
  reducer: {
    boosterSets: boosterSlice.reducer,
    playerSlice: playerSlice.reducer,
    chosenCardsSlice: chosenCardsSlice.reducer,
    basicLandSlice: basicLandSlice.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch