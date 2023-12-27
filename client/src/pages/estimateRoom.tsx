import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import ButtonGroup from "../components/buttonGroup";
import { SOCKET } from "../sockets/socket";
import Votes from "../components/votes";
import { toggleShowVotes } from "../redux/voteSlice";
import Communicate from "../sockets/communicate";

const EstimateRoom = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    SOCKET.on(Communicate.SHOW_VOTES, () => dispatch(toggleShowVotes()));

    return () => {
      SOCKET.off(Communicate.SHOW_VOTES);
    };
  }, [dispatch, user]);

  const handleOnClickReveal = () => {
    SOCKET.emit(Communicate.SHOW_VOTES, user.roomId);
    dispatch(toggleShowVotes());
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
