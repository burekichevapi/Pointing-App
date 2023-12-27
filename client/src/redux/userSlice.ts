import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../models/user";

const userSlice = createSlice({
  name: "user",
  initialState: {
    roomId: "",
    username: "",
    isObserver: false,
    point: 0
  } as User,
  reducers: {
    setUserId: (state: User, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setRoomId: (state: User, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setUsername: (state: User, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    toggleIsObserver: (state: User) => {
      state.isObserver = !state.isObserver;
    },
    setPoint: (state: User, action: PayloadAction<number>) => {
      state.point = action.payload;
    }
  }
});

export const { setUserId, setRoomId, setUsername, toggleIsObserver, setPoint } =
  userSlice.actions;

export default userSlice.reducer;
