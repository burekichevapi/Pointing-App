import { setRoomId, setUsername, toggleIsObserver } from "../redux/userSlice";
import { useAppSelector, RootState, useAppDispatch } from "../redux/store";
import { createRoom, joinRoom } from "../webSocket";
import { v4 as uuidV4, validate as isValidUuid } from "uuid";
import { ChangeEvent } from "react";
import { upsertVote } from "../redux/voteSlice";

const StartForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);

  const handleCreateRoom = () => {
    if (user.username.trim() === "") {
      alert("Enter a username.");
      return;
    }

    const roomId = uuidV4();

    dispatch(setRoomId(roomId));

    createRoom(roomId, user);

    alert(`Room ${roomId} created!`);

    dispatch(upsertVote([user]));
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

    joinRoom(user);

    dispatch(upsertVote([user]));

    alert(`Room ${user.roomId} joined!`);
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
        <label>Current Room: {user.roomId}</label>
      </div>
      <div>
        <button onClick={handleCreateRoom}>Create</button>
        <button onClick={handleJoinRoom}>Join</button>
      </div>
    </div>
  );
};

export default StartForm;
