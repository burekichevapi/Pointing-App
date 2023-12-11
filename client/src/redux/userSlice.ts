import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SliceState = { roomId: string; username: string; isObserver: boolean };

const userSlice = createSlice({
  name: "user",
  initialState: {
    roomId: "",
    username: "",
    isObserver: false
  } as SliceState,
  reducers: {
    setRoomId: (state: SliceState, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setUsername: (state: SliceState, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    toggleIsObserver: (state: SliceState) => {
      state.isObserver = !state.isObserver;
    }
  }
});

export const { setRoomId, setUsername, toggleIsObserver } = userSlice.actions;

export default userSlice.reducer;
