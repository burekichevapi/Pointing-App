import { setRoomId, setUsername, toggleIsObserver } from "../redux/userSlice";
import { useAppSelector, RootState, useAppDispatch } from "../redux/store";
import { joinNewRoom } from "../webSocket";
import { v4 as uuidV4 } from "uuid";
import { ChangeEvent } from "react";

const PointingStartUpForm = () => {
  const dispatch = useAppDispatch();
  const { roomId, username, isObserver } = useAppSelector(
    (state: RootState) => state.user
  );

  const handleNewRoomCreation = () => {
    if (username.trim() === "") {
      alert("Enter a username.");
      return;
    }

    if (roomId === "") {
      dispatch(setRoomId(uuidV4()));
    }

    joinNewRoom(roomId);
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(setUsername(event.target.value));

  const handleIsObserverToggle = () => dispatch(toggleIsObserver());

  return (
    <div>
      <label>
        Username:
        <input type="text" onChange={handleUsernameChange} />
      </label>
      <label>
        Room:
        <input type="text" placeholder="Leave blank to create a new room..." />
      </label>
      <label>
        Join as Observer
        <input
          type="checkbox"
          onChange={handleIsObserverToggle}
          checked={isObserver}
        />
      </label>
      <div>
        <button onClick={handleNewRoomCreation}>Join/Create</button>
      </div>
    </div>
  );
};

export default PointingStartUpForm;
