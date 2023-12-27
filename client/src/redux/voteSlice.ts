import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../models/user";

type VotesState = { votes: User[]; revealVotes: boolean };

const votesSlice = createSlice({
  name: "votes",
  initialState: { revealVotes: false, votes: [] } as VotesState,
  reducers: {
    upsertVote: (state: VotesState, action: PayloadAction<User[]>) => {
      state.votes = action.payload;
    },
    toggleShowVotes: (state: VotesState) => {
      state.revealVotes = !state.revealVotes;
    }
  }
});

export const { upsertVote, toggleShowVotes } = votesSlice.actions;

export default votesSlice.reducer;
