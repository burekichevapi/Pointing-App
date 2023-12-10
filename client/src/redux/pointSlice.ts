import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SliceState = { userSelection: number; broadcastSelection: number };

const pointSlice = createSlice({
  name: "point",
  initialState: {
    userSelection: 0,
    broadcastSelection: 0
  } as SliceState,
  reducers: {
    setUserSelection: (state: SliceState, action: PayloadAction<number>) => {
      state.userSelection = action.payload;
    },
    setBroadcastSelection: (
      state: SliceState,
      action: PayloadAction<number>
    ) => {
      state.broadcastSelection = action.payload;
    }
  }
});

export const { setUserSelection, setBroadcastSelection } = pointSlice.actions;

export default pointSlice.reducer;
