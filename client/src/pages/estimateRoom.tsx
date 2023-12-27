import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import ButtonGroup from "../components/buttonGroup";
import { SOCKET } from "../webSocket";
import Votes from "../components/votes";
import { toggleRevealVotes } from "../redux/voteSlice";

const EstimateRoom = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    SOCKET.on("show_votes", () => dispatch(toggleRevealVotes()));
    SOCKET.emit("on_load", user.roomId);

    return () => {
      SOCKET.off("show_votes");
    };
  }, [dispatch, user]);

  const handleOnClickReveal = () => {
    SOCKET.emit("reveal_votes", user.roomId);
    dispatch(toggleRevealVotes());
  };

  return (
    <>
      <div>Room: {user.roomId}</div>
      {!user.isObserver && (
        <div>
          <ButtonGroup buttons={[0, 1, 2, 3, 5, 8, 13, 21, 34]} />
        </div>
      )}
      <button onClick={handleOnClickReveal}>Reveal</button>
      <div>
        <label>
          {user.username}: {user.point}
        </label>
      </div>
      <Votes />
    </>
  );
};

export default EstimateRoom;
