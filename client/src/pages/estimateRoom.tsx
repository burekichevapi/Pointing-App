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
    const handleBeforeUnload = () => {
      SOCKET.timeout(5000).emit(Communicate.USER_LEAVE_ROOM, user);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch, user]);

  useEffect(() => {
    const onShowVotes = () => dispatch(toggleShowVotes());

    SOCKET.on(Communicate.SHOW_VOTES, onShowVotes);

    return () => {
      SOCKET.off(Communicate.SHOW_VOTES, onShowVotes);
    };
  }, [dispatch, user]);

  const handleOnClickReveal = () => {
    SOCKET.timeout(5000).emit(Communicate.SHOW_VOTES, user.roomId);
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
      <Votes />
    </>
  );
};

export default EstimateRoom;
