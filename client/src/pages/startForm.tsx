import {
  setRoomId,
  setUserId,
  setUsername,
  toggleIsObserver
} from "../redux/userSlice";
import { useAppSelector, RootState, useAppDispatch } from "../redux/store";
import { socket } from "../sockets/socket";
import { v4 as uuidV4, validate as isValidUuid } from "uuid";
import { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import User from "../models/user";
import Communicate from "../sockets/communicate";

const StartForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (user.username.trim() === "") {
      alert("Enter a username.");
      return;
    }

    const roomId = uuidV4();
    const id = uuidV4();

    dispatch(setRoomId(roomId));
    dispatch(setUserId(id));

    socket.connect();
    socket.timeout(5000).emit(Communicate.CREATE_ROOM, {
      ...user,
      roomId,
      id
    } as User);
    navigate(`/vote`);
  };

  const handleJoinRoom = () => {
    if (user.username.trim() === "") {
      alert("Enter a username.");
      return;
    }
    if (!isValidUuid(user.roomId)) {
      alert("Invalid room.");
      return;
    }

    socket.connect();
    socket.timeout(5000).emit(Communicate.JOIN_ROOM, user);

    navigate("/vote");
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(setUsername(event.target.value));

  const handleRoomIdChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(setRoomId(event.target.value));

  const handleIsObserverToggle = () => dispatch(toggleIsObserver());

  return (
    <div>
      <label>
        Username:
        <input type="text" onChange={handleUsernameChange} />
      </label>
      <label>
        Room:
        <input type="text" onChange={handleRoomIdChange} />
      </label>
      <label>
        Join as Observer
        <input
          type="checkbox"
          onChange={handleIsObserverToggle}
          checked={user.isObserver}
        />
      </label>
      <div>
        <button onClick={handleCreateRoom}>Create</button>
        <button onClick={handleJoinRoom}>Join</button>
      </div>
    </div>
  );
};

export default StartForm;
