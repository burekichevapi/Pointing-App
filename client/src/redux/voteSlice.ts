import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../models/user";

type VotesState = { votes: User[] };

const votesSlice = createSlice({
  name: "votes",
  initialState: { votes: [] } as VotesState,
  reducers: {
    upsertVote: (state: VotesState, action: PayloadAction<User[]>) => {
      state.votes = action.payload;
    }
  }
});

export const { upsertVote } = votesSlice.actions;

export default votesSlice.reducer;
